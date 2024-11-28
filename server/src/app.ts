import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs-extra";
import path from "path";
import { sleep } from "./utils/time";

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Paths to JSON data
const usersPath = path.join(__dirname, "data", "users.json");
const productsPath = path.join(__dirname, "data", "products.json");
const falafelPath = path.join(__dirname, "data", "falafel.json");

// Utility function to read JSON data
const readJSON = async (filePath: string) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading JSON file: ${error.message}`);
  }
};

let delayTime = 2000;
// 1. Check if a username exists
app.post("/api/username-check", async (req: Request, res: Response, next) => {
  try {
    await sleep(delayTime + Math.floor(16000 * Math.random()));

    console.log(req.body);

    const username = req.body.username as string;

    if (username === "bug") {
      res.status(400).json({ error: "Username error-bede !!!!" });
      return;
    }

    if (!username) {
      res.status(400).json({ error: "Username parameter is required" });
      return;
    }

    const { users } = await readJSON(usersPath);
    console.log(users);

    const userExists = users.some((user: any) => user.username === username);

    res.json({ username: username, exists: userExists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getFrenchFryPrice = async () => {
  await sleep(12000);
  return 60000;
};

app.post("/api/falafel", async (req: Request, res: Response) => {
  try {
    await sleep(1000);
    console.log(req.body);

    const result = []; // {item , price }

    const options = req.body.options as string[];

    const priceDB = (await readJSON(falafelPath)) as {
      name: string;
      label: string;
      price: number;
    }[];

    let frenchFryUpdatedPrice;
    if (options.includes("french-fries")) {
      frenchFryUpdatedPrice = await getFrenchFryPrice();
    }

    options.forEach((el) => {
      let price;
      if (el === "french-fries") {
        price = frenchFryUpdatedPrice;
      } else {
        price = priceDB.filter((x) => x.name === el)?.[0]?.price;
      }

      result.push({ item: el, price });
    });

    console.log("result =-> ", result);

    const sum = result.reduce(
      (accumulator, currentValue) => +accumulator + +currentValue.price,
      0
    );
    console.log("sum => ", sum);

    res.json({ selectedOptions: result, totalPrice: sum });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
});
app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || "";
    const category = (req.query.category as string) || "";

    const products = await readJSON(productsPath);
    const filteredProducts = products.filter((product: any) => {
      const matchesSearch = search
        ? product.name.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesCategory = category
        ? product.category.toLowerCase() === category.toLowerCase()
        : true;
      return matchesSearch && matchesCategory;
    });

    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. General error handling for invalid routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
