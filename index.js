const express = require("express")
const cors = require("cors")
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// midelware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xmelfag.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db('productDB').collection("product")
    const myCartCollection = client.db('myCartDB').collection("myCart")

    app.get('/products',async(req,res)=>{
      const cursor = productCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/products/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const product = await productCollection.findOne(query)
      res.send(product)
    })

    app.post('/products', async (req, res) => {
      const product = req.body
      console.log(product)
      const result = await productCollection.insertOne(product)
      res.send(result)
    })

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateProduct = req.body
      const product = {
        $set: {
          name: updateProduct.name,
          photo: updateProduct.photo,
          type: updateProduct.type,
          brand: updateProduct.brand,
          ratting: updateProduct.ratting,
          price: updateProduct.price
        }
      }
      const result = await productCollection.updateOne(filter, product, options)
      res.send(result)
    })


    app.get('/myCart', async (req, res) => {
      const result = await myCartCollection.find().toArray()
      res.send(result)
    })

    app.post('/myCart', async (req, res) => {
      const product = req.body
      product.productId = product._id
      delete product._id
      const result = await myCartCollection.insertOne(product)
      res.send(result)
    })

    app.delete('/myCart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id:new ObjectId(id)  }
      const result = await myCartCollection.deleteOne(query)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send("techonolgy surver is running")
})

app.listen(port, () => {
  console.log(`techonology Surver is Running${port}`)
})