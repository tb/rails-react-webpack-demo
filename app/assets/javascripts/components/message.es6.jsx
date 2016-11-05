class Message extends React.Component {
  render () {
    return (
      <div>
        <div>Text: <span className="message--text">{this.props.text}</span></div>
      </div>
    );
  }
}

Message.propTypes = {
  text: React.PropTypes.string
};
