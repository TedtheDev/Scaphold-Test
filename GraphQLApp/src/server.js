import express from 'express';
import graphqlHTTP from 'express-graphql';
import resolverMap from '../graph/resolvers';
import { makeExecutableSchema } from 'graphql-tools';
import startDB from '../mongodb/connection/mongoconnection';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
startDB('scaphold-test');

const schema = fs.readFileSync(path.join(__dirname, '../graph/schema.graphql')).toString();

/**
 * makeExecutableSchema takes your type definitions and field resolvers and returns a GraphQLSchema
 */
const MySchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolverMap,
});

/**
 * A simple express app that takes our GraphQL schema and serves its API.
 */
const app = express();
const PORT = 4000;

app.use('/graphql', graphqlHTTP({
  schema: MySchema,
  graphiql: true
}));
app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
