try {
 //import AccessControl from '../dist/src';
const AccessControl = require('../dist/src').default;
 // const ac = new AccessControl({
 //    'Test': {
 //        'GetUsers': {
 //            dev: true,
 //            staging: false,
 //            prod: false,
 //        }
 //    }
 // });
 //
 const ac = new AccessControl({
    'Test': {
        'GetUsers': {
            dev: true,
            staging: false,
            prod: false,
        }
    }
 });

 console.log(ac.does('Test').havePermission('GetUsers').for('dev'));
 console.log(ac.does('Test').havePermission('GetUsers').for('prod'));
 ac.grant('Test').permission('GetUsers').for('prod');
 console.log(ac.does('Test').havePermission('GetUsers').for('prod'));

} catch (err) {
 console.error('There seems to be a problem with the distribution. Have you run yarn build?');
 console.error(err);
}
