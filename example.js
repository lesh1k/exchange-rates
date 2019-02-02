const getRates = require('./index');

(async () => {
  const rates = await getRates('USD', '2015-01-01', null, true);
  console.log(rates);
})();
