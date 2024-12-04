const express = require("express");
const cors = require("cors");
const {Pool} = require("pg");


const app = express ()
app.use(cors())
app.use(express.json())


const pool = new Pool({


})


app.listen(5001, () => console.log('Server is running on http://localhost:5001'))