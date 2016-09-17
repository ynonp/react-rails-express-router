import React from 'react';
import routes from './routes';

export default function(router) {
  const HelloWorldApp = (props, railsContext) => {
    routes(router);

    const res = { props: props };

    router.handle({ url: railsContext.href, method: 'get', init: true }, res, function() { });
    return React.createElement(res.component, props);
  };

  // This is how react_on_rails can see the HelloWorldApp in the browser.

  return HelloWorldApp;
}

