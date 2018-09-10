import AccessControl from '../';

import { GrantQuery } from '../types';

export default class ACStep {

  query: Partial<GrantQuery>;

  parent: AccessControl;

  constructor(query: Partial<GrantQuery>, parent: AccessControl) {
    this.query = query;
    this.parent = parent;
  }
}