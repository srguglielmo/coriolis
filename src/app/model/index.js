import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';

import { coriolisSchema } from './schema';
import Build from './Build';
// import Post from './model/Post' // ⬅️ You'll import your Models here

// First, create the adapter to the underlying database:
const adapter = new LokiJSAdapter({
  dbName: 'coriolis', // ⬅️ Give your database a name!
  schema: coriolisSchema
});

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [
    Build
  ]
});

export const buildsCollection = database.collections.get('builds');
