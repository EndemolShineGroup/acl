import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import AccessControl, { Stage, ACGrantsObject } from '../src';

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

describe('Access Control', () => {

    // Set console.error spy once
    sinon.spy(console, 'error');

    it('`getGrants()` should return the data passed in the constructor', () => {
        const AC: AccessControl = new AccessControl(GrantsObj);

        expect(AC.getGrants()).to.deep.equal(GrantsObj);
    });

    it('`getGrants()` should return the data passed in via `setGrants()`', () => {
        const AC: AccessControl = new AccessControl();

        AC.setGrants(GrantsObj);

        expect(AC.getGrants()).to.deep.equal(GrantsObj);
    });

    it('`getGrants()` should console.error if no grantsObj has been passed to AccessControl', () => {
        const AC: AccessControl = new AccessControl();

        AC.getGrants();

        expect(console.error).to.be.called;
    });

    it('get permission should return false', () => {
        const AC: AccessControl = new AccessControl(GrantsObj);

        expect(AC.does('User').havePermission('GetUsers').for(Stage.dev)).to.be.false;
    });

    it('get permission should return true', () => {
        const AC: AccessControl = new AccessControl(GrantsObj);

        expect(AC.does('User').havePermission('GetUsers').for(Stage.prod)).to.be.true;
    });

    it('grant permission should return true', () => {
        const AC: AccessControl = new AccessControl(GrantsObj);

        AC.grant('User').permission('GetUsers').for(Stage.dev);

        expect(AC.does('User').havePermission('GetUsers').for(Stage.dev)).to.be.true;
    });

    it('grant permission to a new role should create role with all true stages', () => {
        const AC: AccessControl = new AccessControl(GrantsObj);

        AC.grant('Test').permission('GetUsers').for(Stage.dev, Stage.staging, Stage.prod);

        expect(AC.getGrants()).to.deep.include({
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
        const AC: AccessControl = new AccessControl(GrantsObj);

        AC.grant('Test').permission('GetUsers').for();

        expect(AC.getGrants()).to.deep.include({
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
        const AC: AccessControl = new AccessControl(GrantsObj);

        AC.allow('User').toExtend('Dev');

        expect(AC.does('User').havePermission('GetUsers').for(Stage.dev)).to.be.true
        .and
        expect(AC.does('User').havePermission('GetUsers').for(Stage.staging)).to.be.true
        .and
        expect(AC.does('User').havePermission('GetUsers').for(Stage.prod)).to.be.true
        .and
        expect(AC.does('User').havePermission('SaveUsers').for(Stage.dev)).to.be.true
        .and
        expect(AC.does('User').havePermission('SaveUsers').for(Stage.staging)).to.be.true
        .and
        expect(AC.does('User').havePermission('SaveUsers').for(Stage.prod)).to.be.false
    });

    it('extending role 1 should not have permissions stripped if role 2 doesnt have', () => {
        const AC: AccessControl = new AccessControl(GrantsObj);

        AC.allow('Admin').toExtend('Dev');

        // In `dev` prod is false but `admin` is true, extending `dev` should not make the value false
        expect(AC.does('Admin').havePermission('SaveUsers').for(Stage.prod)).to.be.true
    });

    it('permission denied should return false', () => {
        const AC: AccessControl = new AccessControl(GrantsObj);

        AC.deny('Admin').permission('SaveUsers').for(Stage.prod);

        expect(AC.does('Admin').havePermission('SaveUsers').for(Stage.prod)).to.be.false
    });

    it('remove role should console.error and be inaccessible', () => {
        const AC: AccessControl = new AccessControl(GrantsObj);

        AC.remove('User');

        expect(AC.does('User').havePermission('SaveUsers').for(Stage.prod)).to.be.false

        expect(console.error).to.be.called;
    });
});
