const axios = require("axios");

const FPL_API_URL = "https://fantasy.premierleague.com/api/bootstrap-static/";

const FPLService = {
  fetchFPLData: async () => {
    try {
      const response = await axios.get(FPL_API_URL);
      return response.data; 
    } catch (error) {
      console.error("Error fetching FPL data:", error.message);
      throw new Error("Failed to fetch FPL data");
    }
  },

  // Fetch players from FPL data
  fetchPlayers: async () => {
    const data = await FPLService.fetchFPLData();
    return data.elements; 
  },

  // Fetch teams from FPL data
  fetchTeams: async () => {
    const data = await FPLService.fetchFPLData();
    return data.teams; 
  },

  // Fetch events (gameweeks)
  fetchGameweeks: async () => {
    const data = await FPLService.fetchFPLData();
    return data.events; 
  },
};

module.exports = FPLService;
