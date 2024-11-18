import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let adv;
let collection = [];
console.log(collection);

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://api.adviceslip.com/advice");

    adv = response.data.slip.advice;
    console.log(adv);
    res.render("index.ejs", { data: adv, collection });
  } catch (error) {
    res.render("index.ejs", { error: "failed to make request" });
  }
});

app.post("/", async (req, res) => {
  try {
    const response = await axios.get("https://api.adviceslip.com/advice");
    adv = response.data.slip.advice;
    res.render("index.ejs", { data: adv, collection });
    // colection.push(adv);
    // console.log(`our array colection ${colection}`);
  } catch (error) {
    res.render("index.ejs", { error: "error " });
  }
});

app.post("/post", (req, res) => {
  const newAdvice = {
    advice: req.body.advice,
    id: collection.length + 1,
  };
  collection.push(newAdvice);
  res.redirect("/");
});

app.post("/edit/:id", (req, res) => {
  const adviceId = parseInt(req.params.id);
  const newAdvice = req.body.newAdvice;
  const adviceItem = collection.find((item) => item.id === adviceId);
  if (adviceItem) {
    adviceItem.advice = newAdvice;
  }
  res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
  const adviceId = parseInt(req.params.id);
  collection = collection.filter((item) => item.id !== adviceId);
  res.redirect("/");
});
app.listen(port, () => console.log(`app is listen on port ${port}`));
