import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import AccessControl from '../src';
import { Stage, ACGrantsObject } from '../src/types';

const expect = chai.expect;

chai.use(sinonChai);

const GrantsObj: ACGrantsObject = {
    User: {
        GetUsers: {
            dev: false,
            staging: false,
            prod: true,
        },
        SaveUsers: {
            dev: false,
            staging: false,
            prod: false,
        }
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
        }
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
        }
    }
}

let ACWithGrants: AccessControl;

let ACWithoutGrants: AccessControl

describe('Access Control', () => {

  beforeEach(() => {
    ACWithGrants = new AccessControl(GrantsObj);
    ACWithoutGrants = new AccessControl();
  })

  // Set console.error spy once
  sinon.spy(console, 'error');

  it('`getGrants()` should return the data passed in the constructor', () => {
    expect(ACWithGrants.getGrants()).to.deep.equal(GrantsObj);
  });

  it('`getGrants()` should return the data passed in via `setGrants()`', () => {
    ACWithoutGrants.setGrants(GrantsObj);

    expect(ACWithGrants.getGrants()).to.deep.equal(GrantsObj);
  });

  it('`getGrants()` should console.error if no grantsObj has been passed to AccessControl', () => {
    ACWithoutGrants.getGrants();

    expect(console.error).to.be.called;
  });

  it('get permission should return false', () => {
    expect(ACWithGrants.does('User').havePermission('GetUsers').for(Stage.dev)).to.be.false;
  });

  it('get permission should return true', () => {
    expect(ACWithGrants.does('User').havePermission('GetUsers').for(Stage.prod)).to.be.true;
  });

  it('grant permission should return true', () => {
    ACWithGrants.grant('User').permission('GetUsers').for(Stage.dev);

    expect(ACWithGrants.does('User').havePermission('GetUsers').for(Stage.dev)).to.be.true;
  });

  it('grant permission to a new role should create role with all true stages', () => {
    ACWithGrants.grant('Test').permission('GetUsers').for(Stage.dev, Stage.staging, Stage.prod);

    expect(ACWithGrants.getGrants()).to.deep.include({
      'Test': {
        GetUsers: {
          dev: true,
          staging: true,
          prod: true,
        },
      }
    });
  });

  it('grant permission to a new role should create role with all false stages', () => {
    ACWithGrants.grant('Test').permission('GetUsers').for();

    expect(ACWithGrants.getGrants()).to.deep.include({
          'Test': {
              GetUsers: {
                  dev: false,
                  staging: false,
                  prod: false,
              },
          }
      });
  });

  it('extending role 1 should have all permissions role 2 has', () => {
    ACWithGrants.allow('User').toExtend('Dev');

    expect(ACWithGrants.does('User').havePermission('GetUsers').for(Stage.dev)).to.be.true
      .and
    expect(ACWithGrants.does('User').havePermission('GetUsers').for(Stage.staging)).to.be.true
      .and
    expect(ACWithGrants.does('User').havePermission('GetUsers').for(Stage.prod)).to.be.true
      .and
    expect(ACWithGrants.does('User').havePermission('SaveUsers').for(Stage.dev)).to.be.true
      .and
    expect(ACWithGrants.does('User').havePermission('SaveUsers').for(Stage.staging)).to.be.true
      .and
    expect(ACWithGrants.does('User').havePermission('SaveUsers').for(Stage.prod)).to.be.false
  });

  it('extending role 1 should not have permissions stripped if role 2 doesnt have', () => {
    ACWithGrants.allow('Admin').toExtend('Dev');

    // In `dev` prod is false but `admin` is true, extending `dev` should not make the value false
    expect(ACWithGrants.does('Admin').havePermission('SaveUsers').for(Stage.prod)).to.be.true
  });

  it('permission denied should return false', () => {
    ACWithGrants.deny('Admin').permission('SaveUsers').for(Stage.prod);

    expect(ACWithGrants.does('Admin').havePermission('SaveUsers').for(Stage.prod)).to.be.false
  });

  it('remove role should console.error and be inaccessible', () => {
    ACWithGrants.remove('User');

    expect(ACWithGrants.does('User').havePermission('SaveUsers').for(Stage.prod)).to.be.false

    expect(console.error).to.be.called;
  });
});
