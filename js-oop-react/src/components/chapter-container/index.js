import React, { Component } from "react";

export default class ChapterContainer extends Component {
  constructor() {
    super(...arguments);
    console.log(this.__proto__.constructor.name, "constructor");
    // console.log("ChapterContainer:", this.props);
    this.chapters = this.props.chapters;
  }

  // unsafe
  // componentWillMount() {
  //   console.log(this.__proto__.constructor.name, "componentWillMount");
  // }
  
  componentDidMount() {
    console.log(this.__proto__.constructor.name, "componentDidMount");
  }

  // unsafe
  // componentWillReceiveProps(nextProps) {
  //   console.log(this.__proto__.constructor.name, "componentWillReceiveProps", nextProps);
  // }

  shouldComponentUpdate(){
    console.log(this.__proto__.constructor.name, "shouldComponentUpdate");
    return true;
  }

  // unsafe
  // componentWillUpdate(){
  //   console.log(this.__proto__.constructor.name, "componentWillUpdate");
  // }

  componentDidUpdate(){
    console.log(this.__proto__.constructor.name, "componentDidUpdate");
  }

  componentWillUnmount(){
    console.log(this.__proto__.constructor.name, "componentWillUnmount");
  }

  render() {
    console.log(this.__proto__.constructor.name, "render");
    return (
      <div>
        {
          this.chapters.map(chapter => (
            <div key={chapter.id}>
              <h3>{chapter.title}</h3>
              <pre>{chapter.content}</pre>
            </div>
          ))
        }
      </div>
    );
  }
}