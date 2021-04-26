const express = require('express');
const cors = require("cors");
require("dotenv").config();

const Users = require("./Routes/Users");

const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors({ origin: "*" }));

app.use("/users", Users);


app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
});