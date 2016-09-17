import React from 'react';
import ReactOnRails from 'react-on-rails';
import HelloWorldApp from './HelloWorldApp';
import Router from 'nighthawk';
import ReactDOM from 'react-dom';
import ES6Promises from 'es6-promise';
import fetch from 'isomorphic-fetch';

ES6Promises.polyfill();

const router = new Router();

router.use(function(req, res, next) {
  if (req.init) {
    return next();
  }

  fetch(req.url, {
    method: 'GET',
    redirect: 'follow',
    headers: new Headers({
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    }),
  }).then(function(response) {
    return response.json();
  }).then(function(appstate) {
    res.props = appstate;
    next();
  });
});

router.use(function(req, res, next) {
  next();
  if (res.component) {
    ReactDOM.render(React.createElement(res.component, res.props), document.querySelector('#app'));
  }
});

const view = HelloWorldApp(router);

window.navigateTo = router.changeRoute.bind(router);

ReactOnRails.register({ HelloWorldApp: view });

router.listen({ dispatch: false });
