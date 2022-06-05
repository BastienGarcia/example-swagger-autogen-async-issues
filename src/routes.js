const express = require('express')
const ToolsController = require('./controllers/ToolsController')

function store(req, res) {
    const tools = {}
    return res.status(201).send({})
}

// The routes are not detected using the current latest version of the package
// The proposed fix in 'removeAwait.js' covers some of the use cases
const createRouter = async () => {
    const router = express.Router()

    const apiV1 = require('./controllers/ApiRoute1');
    const apiV2 = require('./controllers/ApiRoute2');

    // The following tests cover multiple use cases with promises/await
    // Await in the method
    router.use('/inline',     await      apiV2);
    // Await reassigned promise
    const reassignedInline = apiV2;
    router.use('/inline/reassigned', await reassignedInline);
    // Awaited require
    router.use('/inline/require', await require('./controllers/ApiRoute2'));
    // Await in var
    const routes =     await    apiV2;
    router.use('/var', routes);
    // Var ending with await (routes should be /signin or /users/:id)
    const apiV2await = require('./controllers/ApiRoute1');
    router.use('/var/endWithAwait', apiV2await );
    // Awaited promise
    const awaited = await require('./controllers/ApiRoute2');
    router.use('/awaited', awaited);
    // Reassigned awaited
    const reassigned = awaited;
    router.use('/awaited/reassigned', reassigned);
    // Promise (not handled)
    await apiV2.then((promisedRoutes) => {
        router.use('/promise', promisedRoutes)
    })
    // Promise.all (not handled)
    await Promise.all([apiV2, new Promise(resolve => setTimeout(resolve, 1))]).then((promisedRoutes) => {
        router.use('/promise/all', promisedRoutes[0]);
    });

    // The following tests make sure that removeAwaits() works safely (don't delete in string/comments)
    // Comment with the word "await"
    router.get('/safe-replace/comment', (req, res) => {
        // #swagger.description = "This comment should keep the word ' await ' and not parse it out"
        res.send('');
    });
    // String with the word "await"
    router.get('/safe-replace/string', express.json(), (req, res) => {
        console.log("` await ");
        console.log(`' await `);
        console.log("\" await ");
        res.send('" await ');
    });

    // Existing examples
    router.use(apiV1)
    router.get('/test-get', ToolsController.show)
    router.post('/test-post', store)
    router.delete('/test-delete/:id', ToolsController.delete)

    return router;
}

module.exports = createRouter();
