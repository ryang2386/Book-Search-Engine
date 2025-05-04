import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import cors from 'cors';
// import routes from './routes/index.js';
import type { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  try {
  await server.start();
  await db();
  } catch (err) {
    console.error('Error starting Apollo Server:', err);
    process.exit(1);
  }

  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow cookies or authentication headers
  }));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', cors<cors.CorsRequest>({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow cookies or authentication headers
  }), expressMiddleware(server as any, {
    context: authenticateToken as any
  }
  ));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html')); 
    });
}

app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`🚀 GraphQL server ready at http://localhost:${PORT}/graphql`);
  }
);

};

startApolloServer();


// if we're in production, serve client/build as static assets
// app.use(routes);

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });
