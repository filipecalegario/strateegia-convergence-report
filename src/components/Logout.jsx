import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button } from "@mui/material";

export default function Logout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.clear();
    navigate("/");
  }

  return (
    <Typography gutterBottom variant="h6" component="h6">
      <Button variant="text" startIcon={<LogoutIcon />} onClick={handleLogout}>
        logout
      </Button>
    </Typography>
  );
}
