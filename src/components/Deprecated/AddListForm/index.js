// Justin Edwards
// 9/23/20
// AddListForm Component - Opens when user presses add new
// list. Allows creation of new list with name and color to
// be used for styling

/* #region IMPORTS */
import React, { useState } from "react";
import {
  Button,
  Typography,
  TextField,
  Grid,
  Container,
  CssBaseline,
  Avatar,
  withStyles,
} from "@material-ui/core";
import { OfflinePin } from "@material-ui/icons";
import { ChromePicker } from "react-color";

import * as Firestore from "../../Firestore";
/* #endregion */

/* #region STYLES */
const styles = {
  addListFormContainer: {
    overflow: "visible",
  },
  mainContainer: {
    padding: 0,
  },
  formHeader: {
    paddingTop: 30,
    paddingRight: 15,
  },
  avatar: {
    margin: "auto",
  },
  iconText: {
    paddingTop: 5,
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
  signInError: {
    color: "#de2020",
    height: 25,
    paddingTop: 5,
  },
  horizontalFlex: {
    display: "flex",
    padding: 0,
    marginBottom: 20,
  },
  nameInput: {
    marginBottom: 10,
  },
};
/* #endregion */

function AddListForm(props) {
  /* #region PROPS/HOOKS */
  const { classes } = props;
  // input hooks
  const [name, setName] = useState(props.name !== undefined ? props.name : "");
  const [color, setColor] = useState(props.color !== undefined ? props.color : "#4fc33f");
  // error hooks
  const [nameError, setNameError] = useState("");
  // const [addListError, setAddListError] = useState(false);
  /* #endregion */

  /* #region INPUT HANDLERS */
  function handleNameChange({ target }) {
    setName(target.value);
  }
  function handleColorChange(color) {
    setColor(color.hex);
  }
  /* #endregion */

  /* #region BASIC VALIDATION */
  function validateName() {
    // empty name
    if (name === "") {
      setNameError("Name Required");
      return false;
    } else {
      setNameError("");
      return true;
    }
  }
  /* #endregion */

  /* #region FORM SUBMISSION */
  // handle form submission
  async function handleSubmit(event) {
    event.preventDefault(); // prevent default post event
    // check for valid email/password first
    if (validateName()) {
      // will be used for loading symbol
      // props.handleAddingList();

      // waits for addList to return new list
      await Firestore.addNewTodoList(name, color)
        .then((newList) => {
          // show snackbar
          props.triggerSnackbar("New List Added");
          props.handleAddListClose();
          // add list of todos with dummy flag
          newList.todos = [{ id: -1 }];
          props.setListToAddLocally(newList);
        })
        .catch(() => {
          // show error on snackbar;
          props.triggerSnackbar("Error Adding list");
        });
    }
  }
  /* #endregion */

  /* #region COMPONENT DISPLAY */
  return (
    <div className={classes.addListFormContainer}>
      <Container
        component="main"
        maxWidth="xs"
        className={classes.mainContainer}
      >
        <CssBaseline />
        <div className={classes.paper}>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <div className={classes.horizontalFlex}>
              <div className={classes.formHeader}>
                <Avatar
                  className={classes.avatar}
                  style={{ backgroundColor: color }}
                >
                  <OfflinePin style={{ color: "white" }} />
                </Avatar>
                <Typography
                  component="h1"
                  variant="h5"
                  className={classes.iconText}
                >
                  Add List
                </Typography>
              </div>
              <Grid item xs={12}>
                <ChromePicker
                  color={color}
                  name="color"
                  id="color"
                  onChange={handleColorChange}
                />
              </Grid>
            </div>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="name"
                label="List Name"
                name="name"
                // autoComplete="email"
                onChange={handleNameChange}
                onBlur={validateName}
                error={nameError !== ""}
                helperText={nameError}
                className={classes.nameInput}
              />
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
            >
              <div>Create</div>
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
  /* #endregion */
}

export default withStyles(styles)(AddListForm);
