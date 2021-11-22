import { Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../features/userSlice";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Home = () => {
  const [name, setName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [isError, setIsError] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10 || name.length === 0) {
      setIsError(true);
      return;
    } else {
      dispatch(setUserInfo({ name, phoneNumber }));
      setIsError(false);
    }
    navigate("/shopping-cart");
  };

  return (
    <Grid container>
      <Grid item xs={12} style={{ margin: "5px" }}>
        <Typography variant="h2">Welcome</Typography>
      </Grid>
      <Grid item xs={12} style={{ margin: "5px" }}>
        <TextField
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></TextField>
      </Grid>
      <Grid item xs={12} style={{ margin: "5px" }}>
        <TextField
          type="number"
          placeholder="Phone Number"
          required
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        ></TextField>
      </Grid>
      <Grid item xs={12} style={{ margin: "5px" }}>
        <Button
          variant="contained"
          endIcon={<ArrowRightAltIcon />}
          onClick={handleSubmit}
        >
          Next
        </Button>
      </Grid>
      {isError ? (
        <Snackbar
          open={isError}
          autoHideDuration={6000}
          onClose={() => setIsError(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="warning" variant="filled">
            Please enter valid name and phone number
          </Alert>
        </Snackbar>
      ) : null}
    </Grid>
  );
};

export default Home;
