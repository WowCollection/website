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


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
});



class CharacterForm extends React.Component {


  constructor(props){
    super(props);

    this.state = {
      server: '',
      labelWidth: 0,
      servers: [],
      serverInfos: [],
      token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE1NTU0ODI2NDMsImV4cCI6MTU1NTUxODY0Mywicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoicm9tYW4ifQ.w90FqpdM73Z8ad_uyvseJ0e6y8M4i-esBZ-tyW6b03edBkLFOF_BmkTYIlkJrwHpMe8dv3JrZ91N5SuLJl41EQ",
      name: 'aikisugi',
      characterInfos: [],
    };

    // Bind this
    this.handleCharacterRequest = this.handleCharacterRequest.bind(this);
  }

  getServerNames() {
    return this.state.servers.map(server => server.name).sort();
  }

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer "+ localStorage.getItem("token"));
    fetch('https://127.0.0.1:8052/realms',
      {
        method: 'GET',
        headers: myHeaders
      })
      .then(response => response.json())
      .then(data => {
        this.setState({servers: data["hydra:member"]});
        }
      )
      .catch(error => console.log(error))

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

  handleCharacterRequest = event => {

    event.preventDefault();

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    fetch('https://127.0.0.1:8052/characters/' + this.state.name + '?realm=dalaran',
      {
        method: 'GET',
        headers: myHeaders
      })
      .then(response => response.json())
      .then(data => {
          this.setState({characterInfos: data, isDisplayed: 1});
        }
      )
      .catch(error => console.log(error))

  }

  render() {
    const { classes } = this.props;

    const serversNames = this.getServerNames();

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

    // Character display information
    let charDisplay = (
      <div>
        <p>ID: {this.state.characterInfos.name}</p>
        <p>Serveur: {this.state.characterInfos.realm}</p>
        <p>Level: {this.state.characterInfos.level}</p>
        <p>Battlegroup: {this.state.characterInfos.battlegroup}</p>
        <p>AchievementPoints: {this.state.characterInfos.achievementPoints}</p>
        <p>Faction: {this.state.characterInfos.faction}</p>
        <p>TotalHonorableKills: {this.state.characterInfos.totalHonorableKills}</p>
      </div>
    );

    return (
      <div>
        <form autoComplete="off" onSubmit={this.handleCharacterRequest}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
              htmlFor="outlined-server-simple"
            >
              Serveur
            </InputLabel>
            {selectServers}

            <TextField
              id="standard-name"
              label="Nom du personnage"
              defaultValue="Aikusigi"
              className={classes.textField}
              onChange={this.handleChangeName('name')}
              margin="normal"
              variant="outlined"
            />
          <Button type="submit" variant="outlined" color="primary" className={classes.button}>
            Afficher
          </Button>
          </FormControl>
        </form>
        {this.state.isDisplayed && charDisplay}
      </div>
    );
  }
}

CharacterForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CharacterForm);
