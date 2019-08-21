const API_KEY = "bUcx7xDKXvZQDgY629OF9v1fNqDFNImK";

// api.giphy.com/v1/gifs/random

function fetchRandomGif(category, cb) {
  return fetch(
    "https://api.giphy.com/v1/gifs/random?q=" + category + "&api_key=" + API_KEY
  ).then(function(response) {
    return response.json();
  });
  // .then(function(responseJson) {
  //   cb(responseJson.data);
  // });
}

function giphyBattle(team1, team2) {
  // console.log(team1);
  // console.log(team2);

  const trendingDate1 = team1.trending_datetime;
  const trendingDate2 = team2.trending_datetime;
  // "0000-00-00 00:00:00"
  // "1970-01-01 00:00:00"
  if (
    (trendingDate1 === "0000-00-00 00:00:00" ||
      trendingDate1 === "1970-01-01 00:00:00") &&
    (trendingDate2 === "0000-00-00 00:00:00" ||
      trendingDate2 === "1970-01-01 00:00:00")
  ) {
    if (team1.import_datetime > team2.import_datetime) {
      return "team1";
    } else if (team1.import_datetime < team2.import_datetime) {
      return "team2";
    } else {
      return null;
    }
  } else {
    if (team1.trending_datetime > team2.trending_datetime) {
      return "team1";
    } else if (team1.trending_datetime < team2.trending_datetime) {
      return "team2";
    } else {
      return null;
    }
  }
}

function getNumberOfGifs(category, number) {
  return new Promise(function(resolve, reject) {
    const collection = [];
    // make number of fetchRandomGif calls
    for (let i = 0; i < number; i++) {
      collection[i] = fetchRandomGif(category);
    }

    Promise.all(collection).then(function(values) {
      console.log("promises", values);
      for (let i = 0; i < number; i++) {
        values[i] = values[i].data;
      }
      resolve(values);
    });
  });
}

function startBattle() {
  console.log("1");
  const teamSize = 6;
  const team1Category = "obama";
  const team2Category = "trump";

  //make a team of six;
  const team1Promise = getNumberOfGifs(team1Category, teamSize);
  const team2Promise = getNumberOfGifs(team2Category, teamSize);

  console.log("1", team1Promise);
  console.log("2", team2Promise);

  Promise.all([team1Promise, team2Promise]).then(function(values) {
    console.log("teams", values);
    const team1 = values[0];
    const team2 = values[1];
    //score
    const score = {
      team1: 0,
      team2: 0
    };
    let i = 0;
    function battles() {
      if (i < teamSize) {
        handleRoundAnimation(i, i - 1);
        setTimeout(function() {
          const result = giphyBattle(team1[i], team2[i]);
          if (result === "team1") {
            console.log("team1 won");
            score.team1 = score.team1 + 1;
          }
          if (result === "team2") {
            console.log("team2 won");
            score.team2 = score.team2 + 1;
          }
          i++;
          battles();
        }, 1000);
      } else {
        handleRoundAnimation(0, 5);
        handleEndgame(score);
      }
    }
    battles();
  });
}
startBattle();

function handleEndgame(score) {
  console.log("Score", score.team1, score.team2);
  if (score.team1 === 0 || score.team2 === 0) {
    console.log("BOOM SHUT OUT! KO! FINISH HIM!");
  }
  if (score.team1 > score.team2) {
    return console.log("TEAM 1 is the Winner!");
  } else if (score.team1 < score.team2) {
    return console.log("TEAM 2 is the Winner!");
  } else {
    console.log("No Winner go again!");
    return startBattle();
  }
}

function handleRoundAnimation(newRound, oldRound) {
  document
    .querySelector(".game-container")
    .classList.remove("round-" + oldRound);
  document.querySelector(".game-container").classList.add("round-" + newRound);
}
