# Exchange rates  
Fetches historical currency exchange rates for a single date or a period of time.
To see in action check [example](./example.js).  
The code is for personal use only and mindful usage without abusing the information provider's website is required.  
Otherwise, make sure to comply with their [terms of use](https://www.exchangerates.org.uk/terms.html)  

# Usage  
The package exports a single function `getRates(baseCurrency, startDate, endDate, log)`  
```js
const getRates = require('exchange-rates');

(async () => {
  const rates = await getRates('USD', '2015-01-01', '2015-01-05', true);
  console.log(rates);
})();
```

# Params  
`baseCurrency` - string - **required** 3 uppercase letters currency code of the currency to be used as reference  
`startDate` - string - **required** date (YYYY-MM-DD) for which to extract data (if `endDate` is provided, this will be the start of the time period)  
`endDate` - string - *optional* date (YYYY-MM-DD) end date for the period to retrieve rates for  
`log` - boolean (default: false) - display console.logs. Might be helpful for large periods of time, to ensure that the exectuion is not stuck.  

# Output  
One of the following formats:

Dates range (JSON)
```JSON
{
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "base": "USD",
  "rates": {
    "YYYY-MM-DD": {
      "AED": 1.0,
      "ANG": 1.0,
      ...
    },
    "YYYY-MM-DD": {
      "AED": 1.0,
      "ANG": 1.0,
      ...
    },
    ...
  }
}
```

Single date
```JS
{
  date: 'YYYY-MM-DD',
  base: 'USD', // Or chosen currency code
  rates: {
    AED: 1.0,
    ANG: 1.0,
    ...
  }
}
```

# Errors  
Throws errors when bad arguments are supplied or if there's an issue fetching the HTML.

# Suggestions  
If the size of the `node_modules` lib is important then there's place for improvement and 
all 3rd party dependencies can be replaced with native node modules. However, for my use case,
the speed of development was key. 