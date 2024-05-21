import express from 'express';
import { Client } from 'pg';

const app = express();
const port: number = 3000;

const client = new Client({
  user: 'postgres', // Replace with your PostgreSQL username
  password: 'postgres', // Replace with your PostgreSQL password
  host: 'localhost', // Replace with your PostgreSQL host
  database: 'bakery-inventory', // Replace with your PostgreSQL database name
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Error connecting to PostgreSQL', err));

// Data types for inventory items
interface InventoryItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

// Function to get all inventory items
async function getInventoryItems(): Promise<InventoryItem[]> {
  const result = await client.query('SELECT * FROM inventory');
  return result.rows;
}

// Function to add a new inventory item
async function addInventoryItem(item: InventoryItem): Promise<void> {
  const { name, description, quantity, price } = item;
  await client.query('INSERT INTO inventory (name, description, quantity, price) VALUES ($1, $2, $3, $4)', [name, description, quantity, price]);
}

// Function to delete an inventory item
async function deleteInventoryItem(id: number): Promise<void> {
  await client.query('DELETE FROM inventory WHERE id = $1', [id]);
}

// Function to update an inventory item
async function updateInventoryItem(item: InventoryItem): Promise<void> {
  const { id, name, description, quantity, price } = item;
  await client.query('UPDATE inventory SET name = $1, description = $2, quantity = $3, price = $4 WHERE id = $5', [name, description, quantity, price, id]);
}

// Function to search for inventory items
async function searchInventoryItems(query: string): Promise<InventoryItem[]> {
  const result = await client.query('SELECT * FROM inventory WHERE name ILIKE $1 OR description ILIKE $1', [`%${query}%`]);
  return result.rows;
}

// Function to check if stock quantity is zero and send alert
async function checkLowStock(): Promise<void> {
  const result = await client.query('SELECT * FROM inventory WHERE quantity = 0');
  const lowStockItems = result.rows;
  if (lowStockItems.length > 0) {
    console.log('Low stock alert:');
    lowStockItems.forEach(item => console.log(`- ${item.name} (ID: ${item.id})`));
    // Implement logic to send alert notifications (e.g., email, SMS)
  }
}

// API endpoints

// Get all inventory items
app.get('/inventory', async (req, res) => {
  try {
    const items = await getInventoryItems();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving inventory items');
  }
});

// Add a new inventory item
app.post('/inventory', async (req, res) => {
  try {
    const item = req.body as InventoryItem;
    await addInventoryItem(item);
    res.json({ message: 'Inventory item added successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).send('Error adding inventory item');
  }
});

// Delete an inventory item
app.delete('/inventory/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await deleteInventoryItem(id);
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).send('Error deleting inventory item');
  }
});

// Update an inventory item
app.put('/inventory/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = req.body as InventoryItem;
    item.id = id;
    await updateInventoryItem(item);
    res.json({ message: 'Inventory item updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).send('Error updating inventory item');
  }
});

// Search for inventory items
app.get('/inventory/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    const items = await searchInventoryItems(query);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(400).send('Error searching inventory items');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  checkLowStock(); // Check for low stock items on startup
});
