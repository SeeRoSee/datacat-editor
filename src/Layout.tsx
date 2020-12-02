import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppDrawer from "./components/AppDrawer";
import BoardingView from "./views/BoardingView";
import {AppBar} from "./components/AppBar";
import {Route, Switch} from "react-router-dom";
import useAuthContext from "./hooks/useAuthContext";
import {Toolbar} from "@material-ui/core";
import Footer from "./components/Footer";
import ConfirmationView from "./views/ConfirmationView";
import Typography from "@material-ui/core/Typography";
import ProfileFormView from "./views/forms/ProfileFormView";
import HierarchyView from "./views/HierarchyView";
import Paper from "@material-ui/core/Paper";
import useGridStyles from "./hooks/useGridStyle";

import "graphiql/graphiql.min.css";
import CatalogEntryRoutes from "./routes/CatalogEntryRoutes";
import GraphiQLEditor from "./GraphiQLEditor";

const drawerWidth = 250;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    graphiql: {
        minHeight: "100vh",
        height: "100%"
    }
}));

export default function Layout() {
    const classes = useStyles();
    const gridStyles = useGridStyles();
    const {token} = useAuthContext();
    const [drawerOpen, setDrawerOpen] = useState(false);

    if (!token) {
        return (
            <div className={classes.content}>
                <CssBaseline/>
                <Switch>
                    <Route path="/confirm">
                        <ConfirmationView/>
                    </Route>
                    <Route>
                        <BoardingView/>
                    </Route>
                </Switch>
                <Footer/>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar onClick={() => setDrawerOpen(true)}/>
            <AppDrawer
                open={drawerOpen}
                variant="temporary"
                onClose={() => setDrawerOpen(false)}
                className={classes.drawer}
                classes={{
                    paper: classes.drawerPaper,
                }}
            />
            <main className={classes.content}>
                <Toolbar/>
                <Switch>
                    <Route exact path="/">
                        <Paper className={gridStyles.paper} variant="outlined">
                            <Typography variant="h4">
                                Willkommen beim datacat editor
                            </Typography>
                            <Typography gutterBottom>
                                Diese Benutzeroberfläche ist ein Software-Preview für den Zugriff auf die datacat API.
                            </Typography>
                            <Typography gutterBottom>
                                Die Benutzeroberfläche erlaubt das Bearbeiten eines Datenkatalogs bestehend aus einer
                                Auswahl an Konzepten entlang eines definierten Entwurfsschemas. Derzeit werden folgende
                                Typen durch die Oberfläche unterstützt - in Klammern wird die konzeptuelle Entsprechung
                                nach ISO12006-3 angegeben, welche durch die datacat API umgesetzt werden:
                            </Typography>

                            <ul>
                                <li>Fachmodell (XtdBag)</li>
                                <li>Gruppe (XtdBag)</li>
                                <li>Klasse (XtdSubject)</li>
                                <li>Merkmalsgruppe (XtdNest)</li>
                                <li>Merkmal (XtdProperty)</li>
                                <li>Wert (XtdValue)</li>
                            </ul>

                            <Typography gutterBottom>
                                Weitere Typen sind in Vorbereitung und werden es ermöglichen den Katalog semantisch
                                weiter
                                auszubauen.
                            </Typography>
                            <Typography>
                                <b>
                                    Wählen Sie im Menübaum (siehe Menü-Taste oben link) den gewünschten Konzepttyp aus
                                    um
                                    mit der Arbeit im Katalog zu beginnen.
                                </b>
                            </Typography>
                        </Paper>

                    </Route>
                    <Route path="/profile">
                        <ProfileFormView/>
                    </Route>
                    <Route path="/search">
                        <HierarchyView/>
                    </Route>
                    <Route path="/graphiql">
                        <Paper className={classes.graphiql}>
                            <GraphiQLEditor/>
                        </Paper>
                    </Route>
                    <CatalogEntryRoutes/>
                </Switch>
                <Footer/>
            </main>

        </div>
    );
}
