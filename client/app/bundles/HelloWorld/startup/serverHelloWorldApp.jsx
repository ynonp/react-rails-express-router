import ReactOnRails from 'react-on-rails';
import HelloWorldApp from './HelloWorldApp';
import Router from 'router';

const router = new Router();
const view = HelloWorldApp(router);
ReactOnRails.register({ HelloWorldApp: view });

