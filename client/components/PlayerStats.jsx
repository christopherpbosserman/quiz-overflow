import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getHighScore } from '../actions/actions';

const mapStateToProps = state => ({
  currentScore: state.quiz.currentScore,
  highScore: state.quiz.highScore,
});

const mapDispatchToProps = {
    getHighScore, 
  }

class CardContainer extends Component {
  constructor(props){
      super(props);
  }

  componentDidMount () { this.props.getHighScore() }

  render() {
      const invisible = this.props.className;
      return(
          <div className={invisible}>
            <p>High Score: {this.props.highScore}</p>
            <p>Current Score: {this.props.currentScore}</p>
          </div>
      )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardContainer);