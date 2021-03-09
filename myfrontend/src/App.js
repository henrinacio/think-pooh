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
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import axios from "axios";

/**
 * STYLE
 */
const useStyles = makeStyles({
  // estiliza o container
  container: {
    marginTop: "15%",
  },
  // estiliza o botão que confirma a busca das jokes
  button: {
    left: "0px",
    right: "0px",
    height: "40px",
    boxShadow: "0 3px 5px 0px rgba(0, 204, 126, 0.25)",
  },
  search: {},
  // estiliza o input do componente de seleção de categorias
  select: {
    fontWeight: "700",
  },
  // estiliza o paper do menu das categorias
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
  // estiliza o item que recebe as jokes
  listItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});

/**
 * APP
 */
export default function App() {
  /**
   * Declaração de:
   *    classes de estilo;
   *    variáveis de state;
   * Variáveis de state:
   *     para listar as categorias buscadas na API,
   *     para colocar as categorias no Select component,
   *     para realização de busca de palavras-chave,
   *     para listar as jokes após pedido de busca do usuário,
   *     para controlar o Circular Progress component,
   *     para controlar o Snackbar component.
   **/
  const classes = useStyles();
  const [list, setList] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [search, setSearch] = useState("");
  const [jokesList, setJokesList] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Busca a lista de categórias na API e seta o state
   */
  useEffect(() => {
    axios
      .get("/getCategories")
      .then((response) => {
        setList(response.data.categories);
        let categories = response.data.categories;
        categories.unshift("any");
        setList(categories);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  /**
   * Busca uma random joke na API e seta o state
   */
  useEffect(() => {
    axios
      .get("/getRandom", {
        onDownloadProgress: setLoading(true),
      })
      .then((response) => {
        const joke = response.data.random_joke;
        setJokesList([joke]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  /**
   * Arrow function para setar a categoria escolhida
   */
  const handleChange = (event) => {
    setCategoryName(event.target.value);
  };

  /**
   * Function para buscar na API e setar a(s) joke(s)
   */
  async function handleAddJoke() {
    // se não possuir inputs
    if (categoryName === "" && search === "") {
      await axios
        .get("/getRandom", {
          onDownloadProgress: setLoading(true),
        })
        .then((response) => {
          const joke = response.data.random_joke;
          setJokesList([joke]);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // se possuir inputs e a categoria não for 'any'
    else if (search && categoryName !== "any") {
      await axios
        .get("/search", {
          params: {
            query: search,
            category: categoryName,
          },
          onDownloadProgress: setLoading(true),
        })
        .then((response) => {
          const values = response.data.jokes.map((item) => item.value);
          setJokesList(values);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // se possuir inputs e a categoria for 'any'
    else if (search && categoryName === "any") {
      await axios
        .get("/search", {
          params: {
            query: search,
            category: "",
          },
          onDownloadProgress: setLoading(true),
        })
        .then((response) => {
          const values = response.data.jokes.map((item) => item.value);
          setJokesList(values);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return (
    <div>
      <Container className={classes.container} maxWidth="sm">
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
            {loading && <CircularProgress size={24} />}
            <List>
              {jokesList.map((jokes) => (
                <ListItem className={classes.listItem} key={jokes}>
                  {jokes}
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
