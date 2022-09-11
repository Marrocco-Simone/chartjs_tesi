const express = require('express');
require("dotenv").config();
const port = process.env.port;

const app = express();
app.use(express.static(__dirname));

app.get('/api', (res,req) => {
    res.json(data);
})

app.listen(port, () => {
    console.log(`chart loaded on http://localhost:${port}`);
});