import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Loader from "../Loader";
import { requestService }from "../../services/RequestService";
import {FormattedMessage} from 'react-intl';
import alertActions from "../../store/actions/alert";
import AchievementsPanels from "../AchievementsPanels";

const styles = theme => ({
  root: {
    margin: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  textField: {
    margin: theme.spacing(1),
    width: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
});

class AchievementForm extends React.Component {

  _isMounted = false;

  constructor(props){
    super(props);

    this.state = {
      server: '',
      labelWidth: 0,
      labelWidthLocale: 0,
      servers: [],
      name: '',
      achievements: [],
      isLoaderServer: false,
      isLoaderAchievement: false,
      isAchievementsDisplayed: false,
      locale: 'frFR',
    };

    // Bind this
    this.handleAchievementRequest = this.handleAchievementRequest.bind(this);
  }

  getServerNames() {
    return this.state.servers.map(server => server.name).sort();
  }


  handleChangeServer = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeName = name => event => {
    this.setState({ [name]: event.target.value });
  };

  serverNameTrim(name){
    return name.toLowerCase().replace(/\s|-|'/g, '');
  }

  handleAchievementRequest = event => {

    const { dispatch } = this.props;

    event.preventDefault();

    if(this.state.server !== '' && this.state.name !== '') {
      this.setState({isLoaderAchievement: true});

      // Character request
      requestService.getAchievements(this.state.name.toLowerCase(), this.state.server.toLowerCase())
        .then(res => {
          console.log(res);
          this.setState({achievements: res['hydra:member'], isAchievementsDisplayed: true, isLoaderAchievement: false})
        })
        .catch(err => {
          this.setState({isLoaderAchievement: false});
          if(err >= 300 && err <= 500) {
            dispatch(alertActions.error(<FormattedMessage id='form.request.error' defaultMessage='Error, please check the form data.' />))
          }
        })
    }
  };

  handleChangeLocale = event => {

    // Checking if it isn't the same locality
    if(this.state.locale !== event.target.value) {

      this.setState({isLoaderServer: true})

      // API call for servers with locale param
      this.setState(
        { [event.target.name]: event.target.value },
        () => {
          requestService.getServers(this.state.locale)
            .then(res => {
              this.setState({servers: res['hydra:member'], isLoaderServer: false})
            })
            .catch(err => {
              this.setState({isLoaderServer: false});
              console.log(err);
            })
        }
      );

    }

  };

  componentDidMount() {

    this._isMounted = true;

    // Setting labels for select inputs
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
      labelWidthLocale: ReactDOM.findDOMNode(this.InputLabelRefLocale).offsetWidth,
    });

    // Request for servers
    requestService.getServers(this.state.locale)
      .then(res => {
        if(this._isMounted)
          this.setState({servers: res['hydra:member']})
      })
      .catch(err =>{
        console.log(err)
      })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }


  render() {
    const { classes } = this.props;

    let serversNames = this.getServerNames();

    const selectServers = (
      <Select
        value={this.state.server}
        onChange={this.handleChangeServer}
        input={
          <OutlinedInput
            labelWidth={this.state.labelWidth}
            name="server"
            id="outlined-server-simple"
          />
        }
      >
        {serversNames.map((name,index) => (
          <MenuItem value={name} key={index}>{name}</MenuItem>
        ))}
      </Select>
    );

    const selectLocale = (
      <Select
        value={this.state.locale}
        onChange={this.handleChangeLocale}
        input={
          <OutlinedInput
            labelWidth={this.state.labelWidthLocale}
            name="locale"
            id="locale-select"
          />
        }
      >
        <MenuItem value='frFR'>FR</MenuItem>
        <MenuItem value='ruRU'>RU</MenuItem>
        <MenuItem value='enGB'>EN</MenuItem>
        <MenuItem value='deDE'>DE</MenuItem>
        <MenuItem value='itIT'>IT</MenuItem>
        <MenuItem value='esES'>ES</MenuItem>
      </Select>
    );

    return (
      <div className={classes.root}>
        <form autoComplete="off" onSubmit={this.handleAchievementRequest}>

          <FormControl required variant="outlined" className={classes.formControl}>
            <InputLabel
              ref={ref => {
                this.InputLabelRefLocale = ref;
              }}
              htmlFor="locale-select"
            >
              <FormattedMessage id='form.local' defaultMessage='Local' />
            </InputLabel>
            {selectLocale}
          </FormControl>

          { this.state.isLoaderServer && <Loader/> }
          { !this.state.isLoaderServer &&
          <FormControl required variant="outlined" className={classes.formControl}>
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
              htmlFor="outlined-server-simple"
            >
              <FormattedMessage id='form.server' defaultMessage='Server' />
            </InputLabel>
            {selectServers}
          </FormControl>
          }

            <TextField
              id="standard-name"
              label={<FormattedMessage id='form.name.character' defaultMessage='Character Name' />}
              className={classes.textField}
              onChange={this.handleChangeName('name')}
              margin="normal"
              variant="outlined"
              required
            />
          <Button type="submit" variant="outlined" color="primary" className={classes.button}>
            <FormattedMessage id='form.go' defaultMessage='Go !' />
          </Button>
        </form>

        {/* Displaying loader during the request time */}
        { this.state.isLoaderAchievement && <Loader/> }

        {/* Displaying datas */}
        {this.state.isAchievementsDisplayed && <AchievementsPanels achievements={this.state.achievements}/>}

      </div>

    );
  }
}

AchievementForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AchievementForm);
