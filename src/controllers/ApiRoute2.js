const express = require('express')
const authorize = require('../middlewares/auth')

const createRouter = async () => {
    const router = express.Router()

    router.route('/test-get').get(authorize, (req, res, next) => {
        // #swagger.description = "Description here..."
        res.status(200).json({
            data: [],
            message: 'Successfully found'
        })
    })

    router.route('/test-delete/:id').delete(authorize, async (req, res, next) => {
        res.status(200).json({
            msg: [],
            message: 'Delete!'
        })
    })

    return router;
}

module.exports = createRouter();
