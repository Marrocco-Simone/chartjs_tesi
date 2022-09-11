const express = require('express');

const app = express();
app.use(express.static(__dirname));

app.get('/api', (res,req) => {
    res.json(data);
})

app.listen(3000, () => {
    console.log(`chart loaded on http://localhost:3000`);
});