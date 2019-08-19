const API_KEY = "bUcx7xDKXvZQDgY629OF9v1fNqDFNImK";

// api.giphy.com/v1/gifs/random

function fetchRandomGif(category, cb) {
  fetch(
    "https://api.giphy.com/v1/gifs/random?q=" + category + "&api_key=" + API_KEY
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(responseJson) {
      cb(responseJson.data);
    });
}

fetchRandomGif("obama", function(giphy1) {
  fetchRandomGif("trump", function(giphy2) {
    // console.log(giphy1);
    // console.log(giphy2);

    const trendingDate1 = giphy1.trending_datetime;
    const trendingDate2 = giphy2.trending_datetime;
    // "0000-00-00 00:00:00"
    // "1970-01-01 00:00:00"
    if (
      (trendingDate1 === "0000-00-00 00:00:00" ||
        trendingDate1 === "1970-01-01 00:00:00") &&
      (trendingDate2 === "0000-00-00 00:00:00" ||
        trendingDate2 === "1970-01-01 00:00:00")
    ) {
      if (giphy1.import_datetime > giphy2.import_datetime) {
        console.log("gihpy1 won");
      } else if (giphy1.import_datetime < giphy2.import_datetime) {
        console.log("gihpy2 won");
      } else {
        console.log("they both lost");
      }
    } else {
      if (giphy1.trending_datetime > giphy2.trending_datetime) {
        console.log("gihpy1 won");
      } else if (giphy1.trending_datetime < giphy2.trending_datetime) {
        console.log("gihpy2 won");
      } else {
        console.log("they both lost");
      }
    }
  });
});
