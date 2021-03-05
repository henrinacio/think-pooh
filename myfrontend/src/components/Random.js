import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Random() {
  const [randomJoke, setRandomJoke] = useState("");

  useEffect(() => {
    axios
      .get("/getRandom")
      .then((response) => {
        setRandomJoke(response.data.random_joke);
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  }, []);

  return <>{randomJoke}</>;
}
