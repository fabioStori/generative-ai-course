import express from "express";
import { InventoryItem } from "../models/inventory-item";
import { Database } from "../utils/database";

export class InventoryService {
  private router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get("/", this.getAllInventoryItems);
    this.router.post("/", this.addInventoryItem);
    this.router.delete("/:id", this.deleteInventoryItem);
    this.router.put("/:id", this.updateInventoryItem);
    this.router.get("/search", this.searchInventoryItems);
  }

  // Add this method to the InventoryService class
public getRouter(): express.Router {
  return this.router;
}

  private async getAllInventoryItems(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const items = await Database.query<InventoryItem>(
        "SELECT * FROM inventory"
      );
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving inventory items");
    }
  }

  private async addInventoryItem(req: express.Request, res: express.Response) {
    try {
      const item = req.body as InventoryItem;
      console.log("req.body 2", req.body);
      // Validate required fields
      if (!item?.name || !item?.description || !item?.quantity || !item?.price) {
        return res.status(400).send("Missing required fields");
      }
      await Database.query(
        "INSERT INTO inventory (name, description, quantity, price) VALUES ($1, $2, $3, $4)",
        [item.name, item.description, item.quantity, item.price]
      );
      res.json({ message: "Inventory item added successfully" });
    } catch (error) {
      console.error(error);
      res.status(400).send("Error adding inventory item");
    }
  }

  private async deleteInventoryItem(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const id = parseInt(req.params.id);
      await Database.query("DELETE FROM inventory WHERE id = $1", [id]);
      res.json({ message: "Inventory item deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(400).send("Error deleting inventory item");
    }
  }

  private async updateInventoryItem(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const id = parseInt(req.params.id);
      const item = req.body as InventoryItem;
      item.id = id;
      await Database.query(
        "UPDATE inventory SET name = $1, description = $2, quantity = $3, price = $4 WHERE id = $5",
        [item.name, item.description, item.quantity, item.price, id]
      );
      res.json({ message: "Inventory item updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(400).send("Error updating inventory item");
    }
  }

  private async searchInventoryItems(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const query = req.query.q as string;
      const items = await Database.query<InventoryItem>(
        "SELECT * FROM inventory WHERE name ILIKE $1 OR description ILIKE $1",
        [`%${query}%`]
      );
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(400).send("Error searching inventory items");
    }
  }
}
