'use strict';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import resolverMap from '../graph/resolvers';
import { makeExecutableSchema } from 'graphql-tools';
import startDB from '../mongodb/connection/mongoconnection';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const server_port = process.env.PORT || 4000;
//var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

mongoose.Promise = global.Promise;
if(process.env.OPENSHIFT_NODEJS_PORT && process.env.OPENSHIFT_NODEJS_IP)
  startDB('scapholdgraphql')
else
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

app.get('/',(req,res)=> {
  res.redirect('/graphql')
})

app.use('/graphql', graphqlHTTP({
  schema: MySchema,
  graphiql: true
}));

app.get('*',(req,res)=> {
  res.redirect('/graphql')
})

app.listen(server_port, () => {
  console.log(`App listening on port: ${server_port}`);
});
