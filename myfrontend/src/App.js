import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/Icon';
import Icon from '@material-ui/core/Icon';
import axios from 'axios';
import theme from './theme';
import Typography from '@material-ui/core/Typography';

/**
 * STYLE
 */
const useStyles = makeStyles({
    root: {
        margin: theme.spacing(10, 0, 3),
    },
    button: {
        left: '0px',
        right: '0px',
        height: '40px',
        boxShadow: '0 3px 5px 0px rgba(0, 204, 126, 0.25)',
    },
    search: {},
    select: {
        fontWeight: '700',
    },
    menuPaper: {
        maxHeight: 330,
        borderRadius: '10px',
    },
    menu: {
        '&$selected': {
            backgroundColor: 'transparent',
            '&:hover': {
                backgroundColor: '#DAF1F2',
            },
        },
        '&:hover': {
            backgroundColor: '#DAF1F2',
        },
    },
    selected: {},
    '@global': {
        '*::-webkit-scrollbar': {
            width: '4px',
        },
        '*::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px #DAF1F2',
            borderRadius: '2px',
        },
        '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#48CCCC',
            borderRadius: '2px',
        },
        '*::-webkit-scrollbar-button:start:decrement': {
            height: '5%',
        },
        '*::-webkit-scrollbar-button:end:increment': {
            height: '5%',
        },
    },
    snackWarning: {
        background: 'rgba(242, 207, 61, 1)',
        color: 'rgba(32, 35, 45, 1)',
        borderRadius: '10px',
        textAlign: 'left',
        boxShadow: 'none',
        fontSize: 'small',
    },
    marginAutoItem: {
        margin: 'auto',
    },
    alignItemsAndJustifyContent: {
        maxWidth: 550,
        minHeight: 150,
        padding: 50,
        display: 'flex',
        boxShadow: '0px 3px 12px 0 rgba(62, 69, 87, 0.25)',
        borderRadius: '10px',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

/**
 * APP
 */
export default function App() {
    /**
     * Declara????o de:
     *    classes de estilo;
     *    vari??veis de state;
     * Vari??veis de state:
     *     para listar as categorias buscadas na API,
     *     para colocar as categorias no Select component,
     *     para realiza????o de busca de palavras-chave,
     *     para listar as jokes ap??s pedido de busca do usu??rio,
     *     para controlar o Circular Progress component,
     *     para controlar o Snackbar component.
     **/
    const classes = useStyles();
    const [list, setList] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [search, setSearch] = useState('');
    const [jokesList, setJokesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);

    /**
     * Busca a lista de categ??rias na API e seta o state
     */
    useEffect(() => {
        axios
            .get('/getCategories')
            .then(response => {
                setList(response.data.categories);
                let categories = response.data.categories;
                categories.unshift('any');
                setList(categories);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    /**
     * Busca uma random joke na API e seta o state
     */
    useEffect(() => {
        axios
            .get('/getRandom', {
                onDownloadProgress: setLoading(true),
            })
            .then(response => {
                const joke = response.data.random_joke;
                setJokesList([joke]);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    /**
     * Arrow function para setar a categoria escolhida
     */
    const handleChange = event => {
        setCategoryName(event.target.value);
    };

    /**
     * Fun????es para setar o fechamento da snackbar
     */
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnack(false);
    };

    const action = (
        <IconButton size="small" onClick={handleClose}>
            <Icon>close</Icon>
        </IconButton>
    );

    /**
     * Function para buscar na API e setar a(s) joke(s)
     */
    async function handleAddJoke() {
        if (categoryName === '' && search === '') {
            /**
             * Busca sem inputs, retorna uma random joke
             */
            await axios
                .get('/getRandom', {
                    onDownloadProgress: setLoading(true),
                })
                .then(response => {
                    const joke = response.data.random_joke;
                    setJokesList([joke]);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                });
        } else if (search === '' && categoryName) {
            /**
             * Busca sem inputs, por categoria, retorna uma random joke
             */
            await axios
                .get('/getByCategory', {
                    params: {
                        category: categoryName,
                    },
                    onDownloadProgress: setLoading(true),
                })
                .then(response => {
                    const joke = response.data.category_jokes;
                    setJokesList([joke]);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                });
        } else if (search && categoryName !== 'any') {
            /**
             * Busca com input e categoria n??o sendo any
             */
            await axios
                .get('/search', {
                    params: {
                        query: search,
                        category: categoryName,
                    },
                    onDownloadProgress: setLoading(true),
                })
                .then(response => {
                    const values = response.data.jokes.map(item => item.value);
                    if (values.length !== 0) {
                        setJokesList(values);
                        setLoading(false);
                    } else {
                        setOpenSnack(true);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        } else if (search && categoryName === 'any') {
            /**
             * Busca com input e categoria sendo any
             */
            await axios
                .get('/search', {
                    params: {
                        query: search,
                        category: '',
                    },
                    onDownloadProgress: setLoading(true),
                })
                .then(response => {
                    const values = response.data.jokes.map(item => item.value);
                    if (values.length !== 0) {
                        setJokesList(values);
                        setLoading(false);
                    } else {
                        setOpenSnack(true);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    return (
        <div className={classes.root}>
            <Container maxWidth="sm">
                <Grid container spacing={3} style={{ textAlign: 'center' }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            className={classes.search}
                            fullWidth={true}
                            id="search"
                            label="Search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} style={{ textAlign: 'left' }}>
                        <FormControl fullWidth={true}>
                            <InputLabel id="category-label">
                                Category
                            </InputLabel>
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
                                {list.map(item => (
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
                        <Snackbar
                            ContentProps={{
                                classes: {
                                    root: classes.snackWarning,
                                },
                            }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            open={openSnack}
                            onClose={handleClose}
                            autoHideDuration={6000}
                            action={action}
                            message="No jokes found. Try search another word."
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {loading && <CircularProgress size={24} />}
                    </Grid>
                    {/* <Grid item xs={12}></Grid> */}
                    <Grid
                        container
                        spacing={3}
                        direction="column"
                        style={{ margin: 'auto' }}
                    >
                        {jokesList.map(jokes => (
                            <Grid
                                key={jokes}
                                item
                                xs={12}
                                className={classes.marginAutoItem}
                            >
                                <Paper
                                    className={
                                        classes.alignItemsAndJustifyContent
                                    }
                                >
                                    <Typography align="center">
                                        {jokes}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}
