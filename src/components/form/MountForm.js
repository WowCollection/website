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
import { requestService } from "../../services/RequestService";
import ProgressBar from "../ProgressBar";
import MountCard from "../MountCard";
import Grid from "@material-ui/core/Grid/Grid";
import {FormattedMessage} from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import alertActions from "../../store/actions/alert";
import {userService} from "../../services/UserService";

const styles = theme => ({
  root: {
    margin: theme.spacing(3),
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

class MountForm extends React.Component {

  _isMounted = false;

  constructor(props){
    super(props);

    this.state = {
      server: '',
      labelWidth: 0,
      labelWidthLocale: 0,
      servers: [],
      name: '',
      resMounts: [],
      mountsCollected: 0,
      mountsNotCollected: 0,
      mountsCollectedPercentage: 0,
      isLoaderMount: false,
      isLoaderServer: false,
      isMountsInfoDisplayed: false,
      locale: 'frFR',
    };

    this.getDefaultValue();

    // Bind this
    this.handleRequest = this.handleRequest.bind(this);
  }

  getServerNames() {
    return this.state.servers.map(server => server.name).sort();
  }

  handleChangeServer = event => {
    this.setState({ [event.target.name]: event.target.value });
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

  handleChangeName = name => event => {
    this.setState({ [name]: event.target.value });
  };

  serverNameTrim(name){
    return name.toLowerCase().replace(/\s|-|'/g, '');
  }

  handleRequest = event => {

    const { dispatch, intl } = this.props;

    event.preventDefault();

    if(this.state.server !== '' && this.state.name !== '') {
      this.setState({isLoaderMount: true});

      requestService.getMounts(this.state.name.toLowerCase(), this.state.server.toLowerCase(), intl.locale)
        .then(res => {
          localStorage.setItem('mount', JSON.stringify(res));
          this.setState({
            resMounts: res,
            isLoaderMount:false,
            mountsCollected: res.numCollected,
            mountsNotCollected: res.numNotCollected,
            mountsCollectedPercentage:  this.getPercentage(res.numCollected, res.numNotCollected),
            isMountsInfoDisplayed: true,
          })
        })
        .catch(err => {
          this.setState({isLoaderMount:false});

          if(err >= 300 && err <= 500) {
            dispatch(alertActions.error(<FormattedMessage id='form.request.error' defaultMessage='Error, please check the form data.' />))
          }
        })

    }

  };

  getPercentage(collected, notCollected) {
    return Math.round((collected / (collected + notCollected)) * 100);
  }

  getMountsCards = () => {
    // Condition can be refacto
    if(typeof this.state.resMounts.name !== 'undefined') {
      return ( this.state.resMounts.collected.map((item, index) => (
        <Grid item xs={12} sm={12} md={6} lg={3} key={index}>
          <MountCard locale={this.props.intl.locale} name={item.name} icon={item.icon} itemId={item.itemId} quality={item.qualityId}/>
        </Grid>
      )))
    }
  };

  getDefaultValue = () => {

    const { auth, dispatch } = this.props;
    const userId = auth.user.data.id;

    userService.getUserCharacter(userId)
      .then(res => {
        if(res.locale || res.server || res.character) {
          this.setState({
            locale: res.locale,
            server: res.server,
            name: res.character,
          });
        }

      })
      .catch(err => {
        if (err >= 300 && err <= 500) {
          dispatch(alertActions.error(<FormattedMessage id='form.request.error' defaultMessage='Error, please check the form data.'/>))
        }
      })
  };

  componentDidMount() {

    this._isMounted = true;

    // Setting labels for select inputs
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
      labelWidthLocale: ReactDOM.findDOMNode(this.InputLabelRefLocale).offsetWidth,
    });

    // Call API for getting servers
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

  componentWillMount() {
    // this.getDefaultValue();

  }


  render() {
    const { classes } = this.props;

    // this.getDefaultValue();

    let serversNames = this.getServerNames();

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

    return (
      <div className={classes.root}>
        <form autoComplete="off" onSubmit={this.handleRequest}>

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
            required
            id="standard-name"
            label={<FormattedMessage id='form.name.character' defaultMessage='Character Name' />}
            className={classes.textField}
            onChange={this.handleChangeName('name')}
            margin="normal"
            variant="outlined"
            value={this.state.name}
            />

          <Button type="submit" variant="outlined" color="primary" className={classes.button}>
            <FormattedMessage id='form.go' defaultMessage='Go !' />
          </Button>
        </form>

        {/* Displaying loader during the request time */}
        { this.state.isLoaderMount && <Loader/> }

        {/* Displaying datas */}
        {this.state.isMountsInfoDisplayed &&
          <React.Fragment>
            <ProgressBar type={<FormattedMessage id='progress.mount' defaultMessage='Mount collected' />} progression={this.state.mountsCollectedPercentage}/>
            <div className={this.props.classes.rootCard}>
              <Grid container direction="row" justify="center" alignItems="center" spacing={3}>
                {this.getMountsCards()}
              </Grid>
            </div>
          </React.Fragment>
        }

      </div>

    );
  }
}

MountForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { intl, auth } = state;
  return {
    intl,
    auth,
  };
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(MountForm);
