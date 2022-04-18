import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllProjects,
  getProjectById,
  getMapById,
  getConvergencePointById,
} from "strateegia-api";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import Album from "../components/Album";
import Logout from "../components/Logout";

export default function Report() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  // const navigate = useNavigate();
  const [labs, setLabs] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState("");
  const [convergencePoints, setConvergencePoints] = useState([]);
  const [selectedCardsIdsByUser, setSelectedCardsIdsByUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quantCards, setQuantCards] = useState(0);

  async function handleProjectChange(event) {
    console.log("change");
    setSelectedProject(event.target.value);
    localStorage.setItem("selectedProject", event.target.value);
    const response = await getProjectById(accessToken, event.target.value);
    console.log(response);
    setMaps(response.maps);
    localStorage.setItem("maps", JSON.stringify(response.maps));
    console.log(maps);
    setSelectedMap(response.maps[0].id);
    localStorage.setItem("selectedMap", response.maps[0].id);
  }

  async function handleMapChange(event) {
    const mapId = event.target.value;
    setSelectedMap(mapId);
    localStorage.setItem("selectedMap", mapId);
  }

  function handleUpdateSelected(event) {
    if (event.target.checked) {
      console.log("add to list");
      console.log(event.target.value);
      setSelectedCardsIdsByUser([
        ...selectedCardsIdsByUser,
        // { id: event.target.value, order: Number(event.target.name)},
        {
          id: event.target.value,
          order: event.target.dataset.order,
          convPointId: event.target.dataset.convPointId,
          questionId: event.target.dataset.questionId,
        },
      ]);
    } else {
      console.log("remove from list");
      console.log(event.target.value);
      setSelectedCardsIdsByUser(
        selectedCardsIdsByUser.filter((item) => item.id !== event.target.value)
      );
    }

    // localStorage.setItem("selectedMapIdsByUser", JSON.stringify(selectedMapIdsByUser));
  }

  function handleGenerateButton() {
    console.log("generate");
    console.log(selectedCardsIdsByUser);
    selectedCardsIdsByUser.sort((a, b) => (a.order > b.order ? 1 : -1));
    if (selectedCardsIdsByUser.length > 0) {
      const auxSelection = {};

      selectedCardsIdsByUser.forEach((item) => {
        if (!auxSelection[item.convPointId]) {
          auxSelection[item.convPointId] = {
            convPointId: item.convPointId,
            questions: [],
          };
        }
        auxSelection[item.convPointId].questions.push({
          questionId: item.questionId,
          order: item.order,
        });
      });

      console.log("auxSelection");
      console.log(auxSelection);
      const populatedSelection = [];

      Object.keys(auxSelection).forEach((item) => {
        console.log("item");
        console.log(item);
        const fullConvPoint = convergencePoints.find(
          (cp) => cp.id === auxSelection[item].convPointId
        );

        if (fullConvPoint) {
          const selectedQuestionIds = auxSelection[item].questions.map(
            (question) => question.questionId
          );
          const filteredQuestions = fullConvPoint.questions.filter((q) => {
            return selectedQuestionIds.includes(q.id);
          });
          console.log("filteredQuestions");
          console.log(filteredQuestions);
          fullConvPoint.questions = [...filteredQuestions];
          populatedSelection.push(fullConvPoint);
        }
      });

      console.log(populatedSelection);
      navigate("/canvas", {
        state: { id: 1, list: JSON.stringify(populatedSelection) },
      });
    } else {
      alert("por favor, selecione pelo menos um ponto de convergência");
    }
  }

  // ================================

  useEffect(() => {
    async function fetchLab() {
      try {
        const labsResponse = await getAllProjects(accessToken);
        setLabs(labsResponse);
        if (localStorage.getItem("selectedProject") !== null) {
          const projectResponse = await getProjectById(
            accessToken,
            localStorage.getItem("selectedProject")
          );
          setMaps(projectResponse.maps);
          setSelectedProject(localStorage.getItem("selectedProject"));
          if (localStorage.getItem("selectedMap") !== null) {
            setSelectedMap(localStorage.getItem("selectedMap"));
          } else {
            setSelectedMap(projectResponse.maps[0].id);
          }
        } else {
          const projectResponse = await getProjectById(
            accessToken,
            labsResponse[0].projects[0].id
          );
          setMaps(projectResponse.maps);
          setSelectedProject(labsResponse[0].projects[0].id);
          localStorage.setItem(
            "selectedProject",
            labsResponse[0].projects[0].id
          );
          setSelectedMap(projectResponse.maps[0].id);
          localStorage.setItem("selectedMap", projectResponse.maps[0].id);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchLab();
  }, []);

  useEffect(() => {
    async function fetchConvergencePoints() {
      try {
        setIsLoading(true);
        const response = await getMapById(accessToken, selectedMap);
        // console.log(response);
        const convergencePointsFromApi = response.points.filter(
          (content) => content.point_type === "CONVERGENCE"
        );
        // console.log(convergencePointsFromApi);
        const allApiCalls = [];
        convergencePointsFromApi.forEach((element) => {
          allApiCalls.push(getConvergencePointById(accessToken, element.id));
        });
        Promise.all(allApiCalls).then((values) => {
          // console.log("values");
          // console.log(values);
          setConvergencePoints((convPoints) => [...values]);
          console.log("convPoints");
          console.log(convergencePoints);
          setIsLoading(false);
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchConvergencePoints();
  }, [selectedMap]);

  useEffect(() => {
    console.log("selected");
    console.log(selectedCardsIdsByUser);
  }, [selectedCardsIdsByUser]);

  useEffect(() => {
    let lengthQuestions = 0;
    convergencePoints.forEach((cp) => {
      lengthQuestions += cp.questions.length;
    });
    setQuantCards(lengthQuestions);
    console.log("quantCards");
    console.log(lengthQuestions);
  }, [convergencePoints]);

  return (
    <>
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Logout />
        <Typography component="h1" variant="h5">
          relatório pontos de convergência
        </Typography>
        <Box></Box>
      </Box>
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
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
                  <MenuItem key={project.id} value={project.id}>
                    {lab.lab.name ? lab.lab.name : "public"} - {project.title}
                  </MenuItem>
                );
              });
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="mapas-label">mapas</InputLabel>
          <Select
            labelId="mapas-label"
            id="mapas"
            value={selectedMap}
            label="mapas"
            onChange={handleMapChange}
          >
            {maps.map((map) => {
              return (
                <MenuItem key={map.id} value={map.id}>
                  {map.title}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      {convergencePoints && convergencePoints.length > 0 ? (
        <Button
          type="button"
          margin="normal"
          variant="contained"
          onClick={handleGenerateButton}
          sx={{ marginBottom: 2, marginTop: 1 }}
        >
          gerar canvas
        </Button>
      ) : (
        <Alert severity="warning">
          mapa selecionado não possui pontos de convergência
        </Alert>
      )}
      {isLoading && (
        <Box sx={{ marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}
      <Album list={convergencePoints} updateSelected={handleUpdateSelected} />
      {quantCards > 10 && (
        <Button
          type="button"
          margin="normal"
          variant="contained"
          onClick={handleGenerateButton}
          sx={{ marginBottom: 3, marginTop: 1 }}
        >
          gerar canvas
        </Button>
      )}
    </>
  );
}
