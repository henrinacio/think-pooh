import React, { useEffect, useState } from 'react';

import { getCategories, getRandomJoke, getJokeByCategory, getJokesBySearch } from './core/api'

import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Paper,
    CircularProgress,
    Snackbar,
    IconButton,
    Icon,
    Typography
} from '@material-ui/core';

/**
 * STYLE
 */
const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(10, 0, 3),
    },
    button: {
        left: '0px',
        right: '0px',
        height: '40px',
        boxShadow: '0 3px 5px 0px rgba(0, 204, 126, 0.25)',
    },
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
    paper: {
        maxWidth: 550,
        minHeight: 150,
        padding: 50,
        margin: '0 16px',
        display: 'flex',
        boxShadow: '0px 3px 12px 0 rgba(62, 69, 87, 0.25)',
        borderRadius: '10px',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

/**
 * APP
 */
export default function App() {
    const classes = useStyles();
    const [list, setList] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [search, setSearch] = useState('');
    const [jokesList, setJokesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);

    useEffect(() => {
        getCategories().then(data => setList(['any', ...data]))
    }, []);

    useEffect(() => {
        setLoading(true)
        getRandomJoke()
            .then(joke => {
                setJokesList([joke]);
            })
            .finally(() => {
                setLoading(false)
            })
    }, []);

    const handleCategoryChange = event => {
        setCategoryName(event.target.value);
    };

    const handleSearchChange = event => {
        setSearch(event.target.value);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnack(false);
    };

    const Action = (
        <IconButton size="small" onClick={handleClose}>
            <Icon>close</Icon>
        </IconButton>
    );

    const handleAddJoke = () => {
        setLoading(true)

        if (!search && (categoryName === 'any' || !categoryName)) {
            return getRandomJoke()
                .then(joke => {
                    setJokesList([joke]);
                })
                .finally(() => {
                    setLoading(false)
                })
        }
        
        if (!search && categoryName) {
            return getJokeByCategory(categoryName)
                .then(joke => setJokesList([joke]))
                .finally(() => {
                    setLoading(false)
                })
        }
        
        return getJokesBySearch(search, categoryName)
            .then(jokes => {
                const values = jokes.map(item => item.value)

                if (!values.length) {
                    setOpenSnack(true)
                } else {
                    setJokesList(values)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <div className={classes.root}>
            <Container maxWidth="sm">
                <Grid container spacing={3} style={{ textAlign: 'center' }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="search"
                            label="Search"
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="category-label">
                                Category
                            </InputLabel>
                            <Select
                                className={classes.select}
                                labelId="category-label"
                                id="category"
                                value={categoryName}
                                onChange={handleCategoryChange}
                                MenuProps={{
                                    classes: { paper: classes.menuPaper },
                                }}
                            >
                                {list.map(item => (
                                    <MenuItem
                                        key={item}
                                        value={item}
                                        classes={{ root: classes.menu }}
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
                            action={Action}
                            message="No jokes found. Try search another word."
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {loading && <CircularProgress size={24} />}
                    </Grid>
                    <Grid container spacing={3} direction="column">
                        {jokesList.map(jokes => (
                            <Grid key={jokes} item xs={12}>
                                <Paper className={ classes.paper }>
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
