const express = require('express');
const app = express();
const host = "127.0.0.1";
const port = process.env.PORT || 5000;

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.listen(port, () => {
    console.log(`The application started successfully at : http://${host}:${port}`);
});