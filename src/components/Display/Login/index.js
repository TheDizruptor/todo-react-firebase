/* Justin Edwards
 * 09/15/2020
 * Sign Up component - Used in a modal to allow the
 * user to sign up for an account. Uses Firestore/index.js
 * functions for database connectivity
 */

/* #region IMPORTS */
import React, { useState } from "react";
import {
  Button,
  Link,
  Typography,
  TextField,
  Grid,
  Container,
  CssBaseline,
  Avatar,
  withStyles,
  LinearProgress,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { useAuthDataContext } from "../../AuthDataProvider";

import * as Firestore from "../../Firestore";
/* #endregion */

/* #region STYLES */
const styles = {
  // mainContainer: {
  //     border: "2px solid black"
  // },
  formHeader: {
    marginTop: 15,
    marginBottom: 15,
  },
  avatar: {
    backgroundColor: "#080808",
    margin: "auto",
  },
  iconText: {
    textAlign: "center",
  },
  submit: {
    backgroundColor: "#080808",
    marginTop: 15,
    color: "white",
    "&:hover": {
      color: "#080808",
      backgroundColor: "#ececec",
    },
  },
  linearProgress: {
    height: 5,
    width: 200,
    backgroundColor: "#f9f9f9",
  },
  signInError: {
    color: "#de2020",
    height: 25,
    paddingTop: 5,
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  },
  signUpLink: {
    cursor: "pointer",
    color: "#504949",
    minHeight: 25,
  },
};
/* #endregion */

function Login(props) {
  /* #region PROPS/HOOKS */
  const { classes } = props;
  const { onLogin } = useAuthDataContext();
  // input hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // error hooks
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signInError, setSignInError] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  /* #endregion */

  /* #region INPUT HANDLERS */
  function handleEmailChange({ target }) {
    setEmail(target.value);
  }
  function handlePasswordChange({ target }) {
    setPassword(target.value);
  }
  /* #endregion */

  /* #region BASIC VALIDATION */
  function validateEmail() {
    // empty email
    if (email === "") {
      setEmailError("Email Required");
      return false;
      // basic regex test for any@any.any - NOT exhaustive
    } else if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      setEmailError("Enter a valid email");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  }
  function validatePassword() {
    // empty password
    if (password === "") {
      setPasswordError("Password Required");
      return false;
      // short password
    } else if (password.length < 6) {
      setPasswordError("Password Too Short");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  }
  /* #endregion */

  /* #region FORM SUBMISSION */
  // handle form submission
  function handleSubmit(event) {
    event.preventDefault(); // prevent default post event
    // check for valid email/password first
    if (validateEmail() && validatePassword()) {
      setSigningIn(false);
      setSignInError("");
      // use information to sign in
      Firestore.signInUser(email, password)
        .then((user) => {
          setSigningIn(false);
          // set user in auth provider
          onLogin(user);
        })
        .catch((error) => {
          setSigningIn(false);
          setSignInError(error);
        });
    }
  }
  /* #endregion */

  /* #region COMPONENT DISPLAY */
  return (
    <div className={classes.mainContainer}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <div className={classes.formHeader}>
            <Avatar className={classes.avatar} color="primary">
              <AccountCircle />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              className={classes.iconText}
            >
              Sign In
            </Typography>
          </div>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleEmailChange}
                  onBlur={validateEmail}
                  error={emailError !== ""}
                  helperText={emailError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handlePasswordChange}
                  onBlur={validatePassword}
                  error={passwordError !== ""}
                  helperText={passwordError}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
            >
              {signingIn ? (
                <div>
                  <LinearProgress className={classes.linearProgress} />
                </div>
              ) : (
                <div>Sign In</div>
              )}
            </Button>
            <Grid container justify="center">
              <Grid item>
                <Link
                  onMouseDown={props.setSignUpModalOpen}
                  variant="body2"
                  className={classes.signUpLink}
                >
                  Don't have an account? Sign Up!
                </Link>
              </Grid>
              <Grid item className={classes.signInError} variant="body2">
                {signInError}
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
  /* #endregion */
}

export default withStyles(styles)(Login);
