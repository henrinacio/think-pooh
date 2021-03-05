import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";

export default function Categories() {
  const [list, setList] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    axios
      .get("/getCategories")
      .then((response) => {
        setList(response.data.categories);
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  }, []);

  const handleChange = (event) => {
    setCategoryName(event.target.value);
  };

  return (
    <>
      <TextField id="search" label="Search"></TextField>
      <FormControl>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          value={categoryName}
          onChange={handleChange}
        >
          {list.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}