const express = require('express')
const uuid = require('uuid')
const app = express()
const port = 3000
app.use(express.json())

//SERVER
app.listen(port, () => {
    console.log(`👾 Server is running on port ${port}`)
})

//DATABASE
const orders = []


//MIDDLEWARE
const checkOrder = (req, res, next) => {
    const { id } = req.params
    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return res.status(404).json({ error: 'Order not found' })
    }

    req.orderId = id
    next()
}

const showRequestMethod = (req, res, next) => {
    console.log('method', req.method)
    console.log('url', req.url);
    next()
}

//ROUTES
app.post('/order', showRequestMethod, (req, res) => {
    const { order, clientName, price } = req.body
    const newOrder = { id: uuid.v4(), order, clientName, price, status: 'Em preparação' }

    orders.push(newOrder)

    return res.status(201).json(newOrder)
})

app.get('/order', showRequestMethod, (req, res) => {
    return res.json(orders)
})

app.get('/order/:id', checkOrder, showRequestMethod, (req, res) => {
    const id = req.orderId
    const index = orders.findIndex(order => order.id === id)

    return res.json(orders[index])
})

app.put('/order/:id', checkOrder, showRequestMethod, (req, res) => {
    const id = req.orderId
    const { order, clientName, price } = req.body
    const index = orders.findIndex(order => order.id === id)
    const clientOrder = orders[index]

    if (order != undefined) {
        clientOrder['order'] = order
    }

    if (clientName != undefined) {
        clientOrder['clientName'] = clientName
    }

    if (price != undefined) {
        clientOrder['price'] = price
    }

    return res.status(201).json(clientOrder)
})

app.patch('/order/:id', checkOrder, showRequestMethod, (req, res) => {
    const id = req.orderId
    const index = orders.findIndex(order => order.id === id)
    const clientOrder = orders[index]

    clientOrder['status'] = 'Seu pedido está pronto! 🍔'

    return res.status(201).json(clientOrder)
})

app.delete('/order/:id', checkOrder, showRequestMethod, (req, res) => {
    const id = req.orderId
    const index = orders.findIndex(order => order.id === id)

    orders.splice(index, 1)

    return res.json({ message: 'Seu pedido foi cancelado!' })
})