const express = require("express");
const router = express.Router();
const axios = require("axios");
const FPLService = require("../fplservice");

router.get("/players", async (req, res) => {
  try {
    const players = await FPLService.fetchPlayers();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch players", details: err.message });
  }
});

router.get("/teams", async (req, res) => {
  try {
    const teams = await FPLService.fetchTeams();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch teams", details: err.message });
  }
});

router.get("/gameweeks", async (req, res) => {
  try {
    const gameweeks = await FPLService.fetchGameweeks();
    res.json(gameweeks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch gameweeks", details: err.message });
  }
});

const API_KEY = "fea67b3095ca972a393700c20a02b614";
const LEAGUE_ID = 39;
const SEASON = 2022;

const fetchPremierLeagueStandings = async () => {
  try {
    const response = await axios.get("https://v3.football.api-sports.io/standings", {
      headers: {
        "x-apisports-key": API_KEY,
        "x-apisports-host": "v3.football.api-sports.io",
      },
      params: {
        league: LEAGUE_ID,
        season: SEASON,
      },
    });
    return response.data.response[0].league.standings[0];
  } catch (error) {
    throw new Error("Failed to fetch standings");
  }
};

router.get("/teams/standings", async (req, res) => {
  try {
    const standings = await fetchPremierLeagueStandings();
    res.json(standings);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch Premier League standings",
      details: err.message,
    });
  }
});

module.exports = router;
