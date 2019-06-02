import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from "@material-ui/core/Grid/Grid";
import Tooltip from '@material-ui/core/Tooltip';


const BorderLinearProgress = withStyles({
  root: {
    height: 25,
    backgroundColor: lighten('#1976d2', 0.5),
    borderRadius: 5,
  },
  bar: {
    borderRadius: 10,
    backgroundColor: '#1976d2',
  },
})(LinearProgress);

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}));

function ProgressBars(props) {
  const classes = useStyles();

  const { progression } = props;

  console.log('prog:',progression);

  return (

    <div className={classes.root}>
      <Grid container spacing={0}>

        <Grid item xs={12} sm={3}>
          <p>Mounts collected</p>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Tooltip title={progression + ' % collected mounts'} aria-label="mounts-collected-percentage">
            <BorderLinearProgress
              className={classes.margin}
              variant="determinate"
              color="secondary"
              value={progression}
            />
          </Tooltip>
        </Grid>
      </Grid>
    </div>

  );
}

export default ProgressBars;
