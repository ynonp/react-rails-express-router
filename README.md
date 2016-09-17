# React-On-Rails + Express Router Demo App

## Why?
Express router is a stable, simpler alternative to react-router. Integrating it with react-on-rails and we have a working, no fuss client side routing.

## How?
The latest express router is available as a standalone module in pillarjs/router, and was already wrapped for browser usage by @wesleytodd in module wesleytodd/nighthawk.

To get them working with react-on-rails this we need to create a separate server/client webpack bundles, server loads pillarjs/router and client loads wesleytodd/nighthawk router. In this demo app they are saved as `webpack.config.js` and `webpack.server.config.js`

Having both bundles we can setup server and client rendering and routing to play nicely with react-on-rails.

## Routes Config

The file `client/app/bundles/HelloWorld/startup/routes.js` holds the list of routes, each is just a mapping from a string to a function that writes the correct component into view:

```language-js
import HelloWorld from '../containers/HelloWorld';
import Home from '../containers/home';

export default function routes(router) {
  router.get('/', respondWith(Home));
  router.get('/hello_world', respondWith(HelloWorld));
  router.get('/hello_world/:name', respondWith(HelloWorld));
}

function respondWith(component) {
  return function(req, res) {
    res.component = component;
    res.props = Object.assign({}, { routerParams: req.params }, res.props);
  }
}
```

The file is called from main app component `HelloWorldApp` to initialise the routes:

```language-jsx
const HelloWorldApp = (props, railsContext) => {
  routes(router);

  const res = { props: props };

  router.handle({ url: railsContext.href, method: 'get', init: true }, res, function() { });
  return React.createElement(res.component, props);
};
```

Besides initialising routes, HelloWorldApp also calls `router.handle`, causing the router to write the correct component into `res.component`, so we can return it and let react-on-rails do the rendering.

## Ajax Navigation
Route navigation is a bit more complex. The client side part is written in file `client/app/bundles/HelloWorld/startup/clientHelloWorldApp.jsx`. It listens for route changes and uses middlewares to fetch new data and render components of the next page. When a URL change is detected router:

1. Fetch data for the new URL using a fetch middleware
2. Decide which component to render using defined routes
3. Use ReactDOM.render to render that component into a div with id #app

This is the code of the middlewares (from that file):

```language-js
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
```

## Server Side: Rails
On the server a single method in ApplicationController is responsible for rendering a page either as a server rendered React component OR as JSON data sent as a reply to the Ajax request:

```language-ruby
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  respond_to :html, :json

  def render_appstate
    response.headers['Cache-Control'] = 'no-cache, no-store, max-age=0, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = 'Fri, 01 Jan 1990 00:00:00 GMT'

    respond_with(@appstate) do |format|
      format.html do
        render file: 'app/views/layouts/application.html.erb', layout: false
      end
      format.json do
        render json: @appstate
      end
    end
  end
end
```

Controllers write their data to the dictionary @appstate and that data is used as the props of the main component in the application. See `home_controller` or `hello_world_controller` for demo.

## Handling Layout
One nice feature of react-router is its ability to build complex layouts. We can get close to that by having a single Layout component used by multiple container components (or built as a higher order component, such as in this exmaple).

This means components composition happens inside each Reach component, instead of in the routes file.

Given Layout is implemented as a HOC, components need to explicitly call it:

```language-jsx
class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome Home</h1>
        <p>{this.props.msg}</p>
        <a href="/hello_world">Page 2</a>
      </div>
    );
  }
}

export default layout(Home);
```

## Triggering navigation
nighthawk wrapper supports both link based navigation and programatically triggered one via the method `changeRoute`. Since router is global and programatic navigation is useful from any component, I added that to `window` object (server side rendering doesn't provide navigation anyways, so nothing's lost).

The relevant line from `clientHelloWorldApp` is:

```language-js
window.navigateTo = router.changeRoute.bind(router);
```

Now we can call `window.navigateTo` from anywhere in the app. For example containers/home uses this in a button click event handler:

```language-js
  handleClick() {
    window.navigateTo('/hello_world');
  }
```


