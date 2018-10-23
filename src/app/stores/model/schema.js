import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'builds',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'code', type: 'string' },
        { name: 'shipId', type: 'string' }
      ]
    })
  ]
});
