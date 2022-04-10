import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects, getProjectById } from "strateegia-api";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

export default function Report() {
  const accessToken = localStorage.getItem("accessToken");
  // const navigate = useNavigate();
  const [labs, setLabs] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState("");

  useEffect(() => {
    async function fetchLab() {
      try {
        const response = await getAllProjects(accessToken);
        setLabs(response);
        console.log(labs);
      } catch (error) {
        console.log(error);
      }
    }
    fetchLab();
  }, []);

  async function handleProjectChange(event) {
    console.log("change");
    setSelectedProject(event.target.value);
    const response = await getProjectById(accessToken, event.target.value);
    console.log(response);
    setMaps(response.maps);
    console.log(maps);
    setSelectedMap(response.maps[0].id);
  }

  async function handleMapChange(event) {
    setSelectedMap(event.target.value);
  }

  return (
    <>
      <Typography component="h1" variant="h5">
        Report
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">jornadas</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedProject}
          label="projetos"
          onChange={handleProjectChange}
        >
          {labs.map((lab) => {
            return lab.projects.map((project) => {
              return (
                <MenuItem value={project.id}>
                  {lab.lab.name ? lab.lab.name : "public"} - {project.title}
                </MenuItem>
              );
            });
          })}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="mapas-label">mapas</InputLabel>
        <Select
          labelId="mapas-label"
          id="mapas"
          value={selectedMap}
          label="projetos"
          onChange={handleMapChange}
        >
          {maps.map((map) => {
            return <MenuItem value={map.id}>{map.title}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </>
  );
}
