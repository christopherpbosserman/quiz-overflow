import React from 'react';

class CheckAnswer extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidUpdate(prevProps){
    if((prevProps.card.question !== this.props.card.question) && (prevProps.currentScore === this.props.currentScore)){
      console.log('update question change/same score')
      return false;
    }
    if((prevProps.card.question !== this.props.card.question) && (prevProps.currentScore !== this.props.currentScore)){
      console.log('update question change/score change')
      return false;
    }
    if(prevProps.card.question !== this.props.card.question){
      console.log('update question change')
      return false;
    }
  }

  // returns div to be rendered
  getDiv(){
    if(this.props.currentScore === 0){
      return (<div key={this.props.card}></div>)
    } else {
      return (<div key={this.props.currentScore} className={"correctFeedback"}>✓</div>)
    }
  }

  render(){
    const feedback = this.getDiv();
    return(
      <div>
        <div className="feedbackContainer">
        {feedback}
        </div>
      </div>
    )
  }
} 

export default CheckAnswer;