const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

const BASE_URL = 'https://www.exchangerates.org.uk/historical/<BASE_CURRENCY>/<DATE>';

function getUrl(baseCurrency, date) {
  const base = baseCurrency.toUpperCase();
  const d = date.split('-').reverse().join('_');
  return BASE_URL.replace('<BASE_CURRENCY>', base).replace('<DATE>', d);
}

async function getHtml(currency, date) {
  const url = getUrl(currency, date);
  const response = await axios.get(url);
  if (response.status !== 200) {
    throw new Error(`Failed to retrieve HTML. URL: ${url}. Status: ${response.status}. Message: ${response.statusText}`);
  }
  return response.data;
}

async function parseHtml(html) {
  const $ = cheerio.load(html);
  const $rows = $('#hd-maintable table tbody tr');
  const rates = {};
  $rows.each(function parse() {
    const text = $(this).find('td').eq(2).text();
    const parts = text.trim().split(' ');
    const currency = parts[3];
    const rate = parseFloat(parts[5], 10);
    rates[currency] = rate;
  });
  return rates;
}

async function getRates(currency, startDate, endDate, log = false) {
  if (startDate && endDate) {
    const start = moment(startDate);
    const end = moment(endDate);
    if (start.isAfter(end)) {
      throw new Error('FetchExchangeRates. Start date cannot be after end date.');
    }
    const promises = [];
    const date = moment(startDate);
    while (!date.isAfter(endDate)) {
      promises.push(getRates(currency, date.format('YYYY-MM-DD'), null, log));
      date.add(1, 'd');
    }
    const rates = await Promise.all(promises);
    const mergedRates = {
      base: currency,
      startDate,
      endDate,
      rates: Object.assign({}, ...rates.map(d => ({ [d.date]: d.rates }))),
    };
    return JSON.stringify(mergedRates);
  }

  if (log) console.log(`Fetching historical exchange rates for ${currency} on ${startDate}`);

  const date = moment(startDate).format('DD_MM_YYYY');
  const html = await getHtml(currency, date);
  const rates = await parseHtml(html);
  const data = {
    date: startDate,
    base: currency,
    rates,
  };
  return data;
}

module.exports = getRates;
