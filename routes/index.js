const express = require('express');
const sheetRoute = require('./sheet.route');
const monthlyUpdateRoute = require('./monthlyUpdate.route');
const sendMailRoute = require('./sendMail.route')
const csvRoute = require('./csv.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/sheet',
        route: sheetRoute
    },
    {
        path: '/sheet',
        route: monthlyUpdateRoute 
    },
    {
        path: '/sheet',
        route: sendMailRoute
    },
    {
        path: '/csv',
        route: csvRoute
    },
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

module.exports = router;