import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class Build extends Model {
  static table = 'builds';

  @field('title') title;

  @field('code') code;

  @field('ship_id') ship_id;
}
