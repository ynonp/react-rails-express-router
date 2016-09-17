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

