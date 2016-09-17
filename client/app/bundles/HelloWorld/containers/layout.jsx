import React from 'react';

export default function(component) {
  return function(props) {
    return (<div>
      <nav>
        <a href="/">Home</a>
        <a href="/hello_world">Hello World</a>
        <a href="/hello_world/ynonp">Hello Ynon</a>
      </nav>
      <main>
        {React.createElement(component, props)}
      </main>
    </div>);
  }
}
