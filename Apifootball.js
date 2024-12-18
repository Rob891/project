const axios = require("axios");

const API_KEY = "0e1766168ec6bd20c8a1475ff6a75cab"; // Replace with your API key
const LEAGUE_ID = 39; // Premier League ID
const SEASON = 2024; // Current season

const fetchPremierLeagueStandings = async () => {
  try {
    const response = await axios.get("https://v3.football.api-sports.io/standings", {
      headers: {
        "x-apisports-key": API_KEY, // Your API key
        "x-apisports-host": "v3.football.api-sports.io",
      },
      params: {
        league: LEAGUE_ID, // Premier League
        season: SEASON,    // Current season
      },
    });

    const standings = response.data.response[0].league.standings[0]; // Extract standings
    return standings;
  } catch (error) {
    console.error("Error fetching Premier League standings:", error.message);
    throw new Error("Failed to fetch standings");
  }
};

// Fetch and log the standings
fetchPremierLeagueStandings()
  .then((standings) => console.log("Premier League Standings:", standings))
  .catch((err) => console.error(err.message));
