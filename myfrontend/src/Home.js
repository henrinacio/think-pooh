import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Random from "./components/Random";
import Categories from "./components/Categories";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  dropdownStyle: {
    boxShadow: "gold",
  },
}));

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <Categories />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Random />
        </CardContent>
      </Card>
    </div>
  );
}
