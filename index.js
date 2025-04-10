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
console.log(`our collection of advice ${collection}`);
const fallbackAdvice = [
  "Stay positive and keep pushing forward.",
  "Every step you take is progress.",
  "Believe in yourself — you've got this!",
  "shprehje motivuese ne shqip1",
];

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.adviceslip.com/advice?timestamp=${Date.now()}`
    );
    adv =
      response.data?.slip?.advice ||
      fallbackAdvice[Math.floor(Math.random() * fallbackAdvice.length)];
    console.log("Advice:", adv);
    res.render("index.ejs", { data: adv, collection });
  } catch (error) {
    console.error("GET / Error:", error.message);
    const randomFallback =
      fallbackAdvice[Math.floor(Math.random() * fallbackAdvice.length)];
    res.render("index.ejs", {
      data: randomFallback,
      error: "Failed to get advice from API. Showing fallback.",
      collection,
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.adviceslip.com/advice?timestamp=${Date.now()}`
    );
    adv =
      response.data?.slip?.advice ||
      fallbackAdvice[Math.floor(Math.random() * fallbackAdvice.length)];
    res.render("index.ejs", { data: adv, collection });
  } catch (error) {
    console.error("POST / Error:", error.message);
    const randomFallback =
      fallbackAdvice[Math.floor(Math.random() * fallbackAdvice.length)];
    res.render("index.ejs", {
      data: randomFallback,
      error: "API down — using backup advice.",
      collection,
    });
  }
});

// app.get("/", async (req, res) => {
//   try {
//     const response = await axios.get("https://api.adviceslip.com/advice");
//     adv = response.data.slip.advice;
//     console.log(adv);
//     res.render("index.ejs", { data: adv, collection });
//   } catch (error) {
//     res.render("index.ejs", { error: "failed to make request", collection });
//   }
// });

// app.post("/", async (req, res) => {
//   try {
//     const response = await axios.get("https://api.adviceslip.com/advice");
//     adv = response.data.slip.advice;
//     res.render("index.ejs", { data: adv, collection });
//   } catch (error) {
//     res.render("index.ejs", { error: "Failed to make post", collection });
//   }
// });

app.post("/save", (req, res) => {
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
