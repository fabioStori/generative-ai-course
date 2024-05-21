import express from 'express';
import {InventoryService} from './services/inventory-service';
import bodyParser from 'body-parser';

const app = express();
const port: number = 3000;
const jsonParser = bodyParser.json();


const inventoryService = new InventoryService();

// Inventory routes
inventoryService.initializeRoutes();
app.use(jsonParser);

// Use the inventory routes with Express
app.use('/inventory', inventoryService.getRouter());

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
