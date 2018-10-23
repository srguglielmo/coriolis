import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const coriolisSchema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'builds',
      columns: [
        {name: 'title', type: 'string', isIndexed: true},
        {name: 'code', type: 'string'},
        {name: 'ship_id', type: 'string'}
      ]
    })
  ]
});
