// require('dotenv').config()
// const express = require('express');
// const path = require('path');
// const db = require('./config/connection');
// const routes = require('./routes');
// const {authMiddleware} = require('./utils/auth');
//
// const cors = require('cors');
//
// const { ApolloServer } = require('apollo-server-express')
//
// const {typeDefs, resolvers} = require('./schemas');
//
//
// const app = express();
// const PORT = process.env.PORT || 3001;
//
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cors());
//
//
// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }
//
// app.use(authMiddleware);
//
// // app.use(routes);
// // initialize apollo server
// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     context: ({req}) => {
//         return {
//             getUser: () => req.user
//         }
//     }
// });
// server.applyMiddleware({app});
//
// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });


require('dotenv').config()
const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const {authMiddleware} = require('./utils/auth');
const cors = require('cors');

const { ApolloServer } = require('apollo-server-express')

const {typeDefs, resolvers} = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
    console.log('here')
    app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);

app.use(authMiddleware);
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        return {
            getUser: () => req.user
        }
    }
});
server.applyMiddleware({app});

db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
