import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Loader from "./Loader";
import RequestService from "../services/RequestService";
import { chatService } from "../services/ChatService";
import ExpansionPanels from "./ExpansionPanels";


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
},
  rootCard: {
    flexGrow: 1,
    margin: theme.spacing(5),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  textField: {
    margin: theme.spacing(1),
    width: 500,
  },
  button: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
});

class ChatForm extends React.Component {


  constructor(props){
    super(props);

    this.state = {
      server: '',
      message: '',
      historicalMessages: [],
      isLoader: false,
      locale: 'frFR',
    };

    // Bind this
    this.handleRequest = this.handleRequest.bind(this);
    this.Request = new RequestService();
  }

  handleRequest = event => {

    event.preventDefault();

    let data = {'text': this.state.message};

    chatService.insertMessage(data)
      .then(this.setState({message: ''}))
      .catch(err => {
        alert(err);
      })

  };

  handleChangeName = message => event => {
    this.setState({ [message]: event.target.value });
  };

  getLatestMessages = () => {
    console.log("hello");

    let messagesPanels = this.state.historicalMessages.map(item => item.text);

    console.log('messagespanels::',messagesPanels);

    return messagesPanels;
  }


  componentDidMount() {

    chatService.getMessages().then(res => {
      this.setState({historicalMessages: res['hydra:member']});
      console.log('historical messages', res['hydra:member']);
    });

    const hubURL = 'https://127.0.0.1:8053/hub';
    const topic = 'https://127.0.0.1:8052/messages/{id}';

    const subscribeURL = new URL(hubURL);
    subscribeURL.searchParams.append('topic', topic);

    const es = new EventSource(subscribeURL.toString());

    let p = null;

    es.onmessage = ({data}) => {
        const {id, text} = JSON.parse(data);
        if(text) {
          if (!id || !text) throw new Error('Invalid payload');

          const messages = document.getElementById('messages');

          // Clear default value
          if(!p) {
            messages.innerHTML = '';
          }

          p = document.createElement('p');

          p.append(document.createTextNode(`${text}`));
          messages.append(p)

        }

      es.onerror = () => {
        console.log('Event source onerror');
        }
      }

  }


  render() {
    const { classes } = this.props;

    return (
      <div>

        <ExpansionPanels messages={this.getLatestMessages()}/>

        <form autoComplete="off" onSubmit={this.handleRequest}>

          <TextField
              id="standard-message"
              label="Message"
              className={classes.textField}
              onChange={this.handleChangeName('message')}
              margin="normal"
              variant="outlined"
              value= {this.state.message}
              autoFocus
            />

          <Button type="submit" variant="outlined" color="primary" className={classes.button}>
            Send
          </Button>
        </form>

        {/* Displaying loader during the request time */}
        { this.state.isLoader && <Loader/> }

        <div id="messages">
          No messages
        </div>

      </div>

    );
  }
}

ChatForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatForm);