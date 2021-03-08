import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import axios from "axios";

const useStyles = makeStyles({
  // estiliza o botão
  button: {
    left: "0px",
    right: "0px",
    height: "40px",
    boxShadow: "0 3px 5px 0px rgba(0, 204, 126, 0.25)",
  },
  search: {},
  // estiliza o input
  select: {
    fontWeight: "700",
  },
  menuPaper: {
    maxHeight: 330,
    borderRadius: "10px",
  },
  // estiliza o background do menu ao selecionar e passar por cima o mouse
  menu: {
    "&$selected": {
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "#DAF1F2",
      },
    },
    "&:hover": {
      backgroundColor: "#DAF1F2",
    },
  },
  selected: {},
  // estiliza o scroll globalmente
  "@global": {
    "*::-webkit-scrollbar": {
      width: "4px",
    },
    "*::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px #DAF1F2",
      borderRadius: "2px",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "#48CCCC",
      borderRadius: "2px",
    },
    "*::-webkit-scrollbar-button:start:decrement": {
      height: "5%",
    },
    "*::-webkit-scrollbar-button:end:increment": {
      height: "5%",
    },
  },
});

export default function App() {
  const classes = useStyles();

  const [list, setList] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [search, setSearch] = useState("");
  const [jokesList, setJokesList] = useState([]);

  useEffect(() => {
    axios
      .get("/getCategories")
      .then((response) => {
        setList(response.data.categories);
        let categories = response.data.categories;
        categories.unshift("any");
        setList(categories);
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  }, []);

  const handleChange = (event) => {
    setCategoryName(event.target.value);
  };

  // renderiza uma joke random ao inicializar a
  useEffect(() => {
    axios
      .get("/getRandom")
      .then((response) => {
        const joke = response.data.random_joke;
        setJokesList([joke]);
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  }, []);

  // função para renderizar as jokes
  async function handleAddJoke() {
    if (categoryName === "" && search === "") {
      await axios
        .get("/getRandom")
        .then((response) => {
          const joke = response.data.random_joke;
          setJokesList([joke]);
        })
        .catch((e) => {
          console.log(e.response.data);
        });
    } else if (search && categoryName) {
      await axios
        .get("/search", {
          params: {
            query: search,
            category: categoryName,
          },
        })
        .then((response) => {
          const values = response.data.jokes.map((item) => item.value);
          setJokesList(values);
        })
        .catch((e) => {
          console.log(e.response.data);
        });
    } else if (search && categoryName === "") {
      await axios
        .get("/search", {
          params: {
            query: search,
            category: "",
          },
        })
        .then((response) => {
          const values = response.data.jokes.map((item) => item.value);
          setJokesList(values);
        })
        .catch((e) => {
          console.log(e.response.data);
        });
    }
  }

  return (
    <div>
      <Container maxWidth="sm">
        <Grid container spacing={3} style={{ textAlign: "center" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              className={classes.search}
              fullWidth={true}
              id="search"
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            ></TextField>
          </Grid>
          <Grid item xs={12} sm={6} style={{ textAlign: "left" }}>
            <FormControl fullWidth={true}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                className={classes.select}
                labelId="category-label"
                id="category"
                value={categoryName}
                onChange={handleChange}
                MenuProps={{
                  classes: { paper: classes.menuPaper },
                }}
              >
                {list.map((item) => (
                  <MenuItem
                    key={item}
                    value={item}
                    classes={{
                      root: classes.menu,
                      selected: classes.selected,
                    }}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              className={classes.button}
              color="secondary"
              variant="contained"
              onClick={handleAddJoke}
            >
              Get a new random fact!
            </Button>
          </Grid>

          <Grid item xs={12}>
            <List>
              {jokesList.map((jokes) => (
                <ListItem key={jokes}>{jokes}</ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
