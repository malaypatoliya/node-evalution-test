const express = require('express');
require('dotenv').config();
const setRoutes = require('./routeSetters/routeSetters');

const app = express();
app.use(express.json());

setRoutes(app);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port http://localhost:${process.env.PORT}`);
});
