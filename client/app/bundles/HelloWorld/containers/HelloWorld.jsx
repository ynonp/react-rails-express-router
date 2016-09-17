import React, { PropTypes } from 'react';
import HelloWorldWidget from '../components/HelloWorldWidget';
import layout from './layout';

// Simple example of a React "smart" component
class HelloWorld extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired, // this is passed from the Rails view
  };

  constructor(props, context) {
    super(props, context);

    // How to set initial state in ES6 class syntax
    // https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    this.state = { name: this.props.name };
  }

  updateName(name) {
    this.setState({ name });
  }

  render() {
    return (
      <div>
        <p>Name: {this.props.routerParams ? this.props.routerParams.name : 'Unknown'}</p>
        <HelloWorldWidget name={this.state.name} updateName={e => this.updateName(e)} />
      </div>
    );
  }
}

export default layout(HelloWorld);
