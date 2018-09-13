import AccessControl from '../AccessControl';

import { GrantQuery } from '../types';

export default class Step {

  query: Partial<GrantQuery>;

  parent: AccessControl;

  constructor(query: Partial<GrantQuery>, parent: AccessControl) {
    this.query = query;
    this.parent = parent;
  }
}
