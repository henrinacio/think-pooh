import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: { main: '#48CCCC' },
        secondary: { main: '#25EFA1' },
        background: { default: '#fff' },
    },
    typography: {
        fontFamily: ['Mulish'],
        button: {
            fontWeight: '700',
            textTransform: 'none',
        },
    },
});

export default theme;
