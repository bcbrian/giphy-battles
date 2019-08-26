const presidents = [
  "Washington",
  "Adams",
  "Jefferson",
  "Madison",
  "Monroe",
  "Adams",
  "Jackson",
  "Buren",
  "Harrison",
  "Tyler",
  "Polk",
  "Taylor",
  "Fillmore",
  "Pierce",
  "Buchanan",
  "Lincoln",
  "Johnson",
  "Grant",
  "Birchard",
  "Garfield",
  "Arthur",
  "Cleveland",
  "Harrison",
  "Cleveland",
  "McKinley",
  "Roosevelt",
  "Taft",
  "Wilson",
  "Harding",
  "Coolidge",
  "Hoover",
  "Roosevelt",
  "Truman",
  "Eisenhower",
  "Kennedy",
  "Johnson",
  "Nixon",
  "Ford",
  "Carter",
  "Reagan",
  "Bush",
  "Clinton",
  "Bush",
  "Obama",
  "Trump"
];

function fetchRandomPokemonName(cb) {
  fetch(
    "https://pokeapi.co/api/v2/pokemon/" +
      (Math.floor(Math.random() * 151) + 1) +
      "/"
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(responseJson) {
      cb(responseJson.name);
    });
}
// select button and add click listener
document.querySelector(".start-btn").addEventListener("click", function() {
  // when the click happens
  // select our pannels and add open class
  document.querySelector(".left-panel").classList.toggle("open");
  document.querySelector(".right-panel").classList.toggle("open");
  // make button disapear by adding hidden class
  document.querySelector(".start-btn").classList.toggle("hidden");
  document.querySelector(".btn-container").classList.toggle("hidden");
});

document.querySelectorAll(".battle-btn").forEach(function(battleBtnEl) {
  battleBtnEl.addEventListener("click", function(event) {
    if (event.target.innerHTML.toLowerCase() === "presidents") {
      document.querySelector(".start-container").classList.toggle("hidden");
      document.querySelector(".game-container").classList.toggle("hidden");

      setTimeout(function() {
        startBattle(
          presidents[Math.floor(Math.random() * presidents.length)],
          presidents[Math.floor(Math.random() * presidents.length)]
        );
      }, 500);
    }
    if (event.target.innerHTML.toLowerCase() === "pokemon") {
      document.querySelector(".start-container").classList.toggle("hidden");
      document.querySelector(".game-container").classList.toggle("hidden");
      fetchRandomPokemonName(function(team1Name) {
        fetchRandomPokemonName(function(team2Name) {
          setTimeout(function() {
            startBattle(team1Name, team2Name);
          }, 500);
        });
      });
    }
    if (event.target.innerHTML.toLowerCase() === "dramatic chipmunk") {
      document.querySelector(".start-container").classList.toggle("hidden");
      document.querySelector(".game-container").classList.toggle("hidden");
      setTimeout(function() {
        startBattle("dramatic chipmunk", "my little pony");
      }, 500);
    }
  });
});

// BATTLE JS
const API_KEY = "bUcx7xDKXvZQDgY629OF9v1fNqDFNImK";

// api.giphy.com/v1/gifs/random

function fetchRandomGif(category, cb) {
  return fetch(
    "https://api.giphy.com/v1/gifs/random?rating=g&tag=" +
      category +
      "&api_key=" +
      API_KEY
  ).then(function(response) {
    return response.json();
  });
  // .then(function(responseJson) {
  //   cb(responseJson.data);
  // });
}

function giphyBattle(team1, team2) {
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
      for (let i = 0; i < number; i++) {
        values[i] = values[i].data;
      }
      resolve(values);
    });
  });
}

function startBattle(team1Name, team2Name) {
  const teamSize = 6;

  //make a team of six;
  const team1Promise = getNumberOfGifs(team1Name, teamSize);
  const team2Promise = getNumberOfGifs(team2Name, teamSize);

  Promise.all([team1Promise, team2Promise]).then(function(values) {
    const team1 = values[0];
    const team2 = values[1];

    renderGifs("team-1", team1);
    renderGifs("team-2", team2);
    //score

    const score = {
      team1: {
        score: 0,
        name: team1Name
      },
      team2: {
        score: 0,
        name: team2Name
      }
    };
    updateScores(score);
    let i = 0;
    function battles() {
      if (i < teamSize) {
        handleRoundAnimation(i, i - 1);
        setTimeout(function() {
          const result = giphyBattle(team1[i], team2[i]);
          if (result === "team1") {
            score.team1.score = score.team1.score + 1;
          }
          if (result === "team2") {
            score.team2.score = score.team2.score + 1;
          }
          i++;
          updateScores(score);
          battles();
        }, 500);
      } else {
        handleRoundAnimation(0, 5);
        handleEndgame(score);
      }
    }
    battles();
  });
}
// startBattle();

function handleEndgame(score) {
  let message = "";
  const score1 = _.get(score, "team1.score");
  const score2 = _.get(score, "team2.score");
  const name1 = _.get(score, ["team1", "name"]);
  const name2 = _.get(score, ["team2", "name"]);
  if (score1 === 0 || score2 === 0) {
    message += "BOOM SHUT OUT! KO! FINISH HIM! ";
  }
  if (_.gt(score1, score2)) {
    message += name1 + " is the Winner!";
  } else if (_.lt(score1, score2)) {
    message += name2 + " is the Winner!";
  } else {
    message += "No Winner!";
  }
  document.querySelector(".message-container").classList.toggle("hidden");
  document.querySelector(".message").innerHTML = message;
}

function handleRoundAnimation(newRound, oldRound) {
  document
    .querySelector(".game-container")
    .classList.remove("round-" + oldRound);
  document.querySelector(".game-container").classList.add("round-" + newRound);
}

function updateScores(scores) {
  document.querySelector(".team-1-score").innerHTML = scores.team1.score;
  document.querySelector(".team-1-score-title").innerHTML = scores.team1.name;
  document.querySelector(".team-2-score").innerHTML = scores.team2.score;
  document.querySelector(".team-2-score-title").innerHTML = scores.team2.name;
}

function renderGifs(teamName, team) {
  _.forEach(team, function(gif, i) {
    const gifContainer = document.querySelector(
      ".gif." + teamName + ".pos-" + i
    );
    gifContainer.innerHTML =
      "<img class='animated' src='" +
      gif.images.fixed_width.url +
      "'/>" +
      "<img class='still' src='" +
      gif.images.fixed_width_still.url +
      "'/>";
  });
}

//Battle reset
document.querySelector(".reset-btn").addEventListener("click", function(event) {
  document.querySelector(".message").innerHTML = "";
  document.querySelector(".message-container").classList.toggle("hidden");
  document.querySelector(".start-container").classList.toggle("hidden");
  document.querySelector(".game-container").classList.toggle("hidden");
});
