import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Album from "../components/Album";
import Button from "@mui/material/Button";

export default function Canvas() {
  const location = useLocation();
  const navigate = useNavigate();
  const receivedList = JSON.parse(location.state.list);
  const [list, setList] = useState([]);

  useEffect(() => {
    setList([...receivedList]);
  }, []);

  function handleBackButton() {
    navigate("/report");
  }

  return (
    <div>
      <h1>Canvas</h1>

      <Button
        type="button"
        margin="normal"
        variant="contained"
        onClick={handleBackButton}
        sx={{ marginBottom: 2, marginTop: 1 }}
      >
        voltar para relatório
      </Button>

      <Album list={list} updateSelected={null} />
    </div>
  );
}
