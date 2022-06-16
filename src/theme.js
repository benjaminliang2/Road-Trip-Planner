import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#383838",
            light: "skyblue"
        },
        secondary: {
            main: '#ffff'
        },
        otherColor: {
            main: "#999"
        }
    },
    typography: {
        fontFamily: [
            'Inter',
        ].join(','),
    }
});
