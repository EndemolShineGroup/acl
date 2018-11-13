import { Roles } from '../types';

const GrantsObj: Roles = {
  User: {
    GetUsers: {
      dev: false,
      staging: false,
      prod: true,
    },
    SaveUsers: {
      dev: false,
      staging: true,
      prod: false,
    },
  },
  Admin: {
    GetUsers: {
      dev: true,
      staging: true,
      prod: true,
    },
    SaveUsers: {
      dev: true,
      staging: true,
      prod: true,
    },
  },
  Dev: {
    GetUsers: {
      dev: true,
      staging: true,
      prod: true,
    },
    SaveUsers: {
      dev: true,
      staging: true,
      prod: false,
    },
  },
};

export default GrantsObj;
