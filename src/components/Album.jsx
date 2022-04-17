import { Checkbox } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";

// const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();

export default function Album({ list, updateSelected }) {
  const convergencePoints = list;

  function handleChangeCheckbox(event) {
    updateSelected(event);
  }

  function calculateHigherOption(options) {
    const optionsCopy = [...options];
    optionsCopy.sort((a, b) => (a.average > b.average ? -1 : 1));
    const option = optionsCopy[0];
    // return {id:optionsCopy[0].id, text:optionsCopy[0].text, average:optionsCopy[0].average};
    return (
      <Box key={option.id} sx={{ marginTop: 1 }}>
        <Typography variant="body1">{option.text}</Typography>
        <Typography variant="subtitle2">
          {(option.average * 100).toFixed(0)}%
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Container sx={{ py: 1 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={2}>
            {convergencePoints.map((convPoint, indexConvPoint) =>
              convPoint.questions.map((question, indexQuestion) => (
                <Grid item key={question.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h7" component="h6">
                        {convPoint.id} - {question.id}
                      </Typography>
                      <Typography variant="body2" component="p">
                        {question.text}
                      </Typography>
                      {calculateHigherOption(question.options)}
                    </CardContent>
                    {updateSelected && (
                      <Checkbox
                        value={`${convPoint.id}#${question.id}`}
                        onChange={(event) => updateSelected(event)}
                        inputProps={{
                          "aria-label": "controlled",
                          "data-order": `${indexConvPoint}-${indexQuestion}`,
                          "data-question-id": question.id,
                          "data-conv-point-id": convPoint.id,
                        }}
                      />
                    )}
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}
