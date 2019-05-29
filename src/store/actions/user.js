import { userConstants } from '../constants/user';
import { userService } from '../../services/UserService';
import { alertActions } from './alert';
import { history } from '../../helpers/history';

export const userActions = {
  login,
  logout,
  register,
  // getAll
};

function login(username, password) {
  return dispatch => {
    dispatch(request({ username }));

    userService.login(username, password)
      .then(
        user => {
          // Adding username to the object
          user.username = username;
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

  function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
  function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
  function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
  userService.logout();
  return { type: userConstants.LOGOUT };
}

function register(username, plainPassword, email) {
  return dispatch => {
    dispatch(request({ username }));

    userService.register(username, plainPassword, email)
      .then(
        user => {
          // Adding username to the object
          user.username = username;
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


  function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
  function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
  function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }

}

// function getAll() {
//   return dispatch => {
//     dispatch(request());
//
//     userService.getAll()
//       .then(
//         users => dispatch(success(users)),
//         error => {
//           dispatch(failure(error));
//           dispatch(alertActions.error(error))
//         }
//       );
//   };
//
//   function request() { return { type: userConstants.GETALL_REQUEST } }
//   function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
//   function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
// }
