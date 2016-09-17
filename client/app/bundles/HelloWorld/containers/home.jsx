import React from 'react';
import layout from './layout';

// Simple example of a React "smart" component
class Home extends React.Component {
  handleClick() {
    window.navigateTo('/hello_world');
  }

  render() {
    return (
      <div>
        <h1>Welcome Home</h1>
        <p>{this.props.msg}</p>
        <a href="/hello_world">Page 2</a>
        <button onClick={() => this.handleClick()}>Page 2 Programatically</button>
      </div>
    );
  }
}

export default layout(Home);
