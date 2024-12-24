const express = require("express");
const router = express.Router();
const playersController = require("../controllers/PlayerController");



router.get("/", playersController.getAllPlayers);

router.get("/:id", playersController.getPlayerById);

router.post("/", playersController.createPlayer);
router.get("/name/:name", playersController.getPlayerIdByName);
router.put("/:id", playersController.updatePlayer);

router.delete("/:id", playersController.deletePlayer);

router.post("/sync", playersController.syncPlayers);



module.exports = router;
