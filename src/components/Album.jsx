import { Checkbox } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";

// const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();

export default function Album(props) {
  const navigate = useNavigate();
  const cards = props.list;

  const [selected, setSelected] = React.useState([]);

  function handleChangeCheckbox(event) {
    if (event.target.checked) {
      console.log("add to list");
      console.log(event.target.value);
      setSelected([...selected, event.target.value]);
    } else {
      console.log("remove from list");
      console.log(event.target.value);
      setSelected(selected.filter((item) => item !== event.target.value));
    }
  }

  function handleGenerateButton() {
    console.log("generate");
    console.log(selected);
    navigate("/canvas", { state: { id: 1, list: JSON.stringify(selected) } });
  }

  React.useEffect(() => {
    console.log("selected");
    console.log(selected);
  }, [selected]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Button
          type="button"
          margin="normal"
          variant="contained"
          onClick={handleGenerateButton}
        >
          Generate Canvas
        </Button>
        <Container sx={{ py: 1 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={2}>
            {cards.map((card) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* <CardMedia
                    component="img"
                    sx={{
                      // 16:9
                      pt: "56.25%",
                    }}
                    image="https://source.unsplash.com/random"
                    alt="random"
                  /> */}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h7" component="h6">
                      {card.id}
                    </Typography>
                    <Typography variant="body2">
                      {card.questions[0].text}
                    </Typography>
                    {card.questions[0].options.map((option) => {
                      return (
                        <>
                          <Box sx={{ marginTop: 1 }}>
                            <Typography variant="body1">
                              {option.text}
                            </Typography>
                            <Typography variant="subtitle2">
                              {(option.average * 100).toFixed(0)}%
                            </Typography>
                          </Box>
                        </>
                      );
                    })}
                  </CardContent>
                  <Checkbox
                    value={card.id}
                    onChange={handleChangeCheckbox}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  {/* <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                  </CardActions> */}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}
