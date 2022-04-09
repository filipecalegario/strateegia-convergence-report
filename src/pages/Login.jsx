import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { useState } from "react";
import {auth} from "strateegia-api";

// const API_URL_USERS = "https://api.strateegia.digital/users/v1/";

function Login() {
  const [login, setLogin] = useState({ user: "", password: "" });

  function handleChange(e) {
    setLogin({ ...login, [e.target.name]: e.target.value });
    console.log(login);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const accessToken = await auth(login.user, login.password);
      console.log(accessToken);
      localStorage.setItem("accessToken", accessToken);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <h1>Login</h1>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          // border: "1px solid black",
        }}
      >
        <TextField
          margin="normal"
          id="standard-basic"
          label="Usuário"
          variant="outlined"
          type="text"
          onChange={handleChange}
          name="user"
        />
        <TextField
          margin="normal"
          id="standard-basic"
          label="Senha"
          variant="outlined"
          type="password"
          onChange={handleChange}
          name="password"
        />
        <Button
          type="button"
          margin="normal"
          variant="contained"
          onClick={handleSubmit}
        >
          Login
        </Button>
      </form>
    </>
  );
}

export default Login;
