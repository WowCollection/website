import { userConstants } from '../constants/user';
import { userService } from '../../services/UserService';
import { alertActions } from './alert';
import { history } from '../../helpers/history';

export const userActions = {
  login,
  logout,
  register,
  renewToken,
};

function login(username, password) {
  return dispatch => {

    userService.login(username, password)
      .then(
        user => {
          // Dispatch success action
          dispatch(success(user));
          history.push('/');
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
  function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function renewToken(data) {
  return dispatch => {
    userService.renewToken(data)
      .then(
        user => {
          // Dispatch success action
          dispatch(success(user));
          window.location.reload();
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function success(user) { return { type: userConstants.RENEW_SUCCESS, user } }
  function failure(error) { return { type: userConstants.RENEW_FAILURE, error } }
}

function register(username, plainPassword, email) {
  return dispatch => {
    userService.register(username, plainPassword, email)
      .then(
        user => {
          // Dispatch info
          dispatch(success(user, username, plainPassword));
          dispatch(alertActions.success(`Compte créé, bienvenue ${username} !`));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function success(user, username, plainPassword) {
    return dispatch => {
      dispatch(login(username, plainPassword));
      return { type: userConstants.REGISTER_SUCCESS, user };
    };
  }
  function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }

}

function logout() {
  userService.logout();
  return { type: userConstants.LOGOUT };
}
