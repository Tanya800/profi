
const express = require('express');

const app = express();


var router = require('./routes/promo.routes');


// парсинг JSON, содержащегося в теле запроса
app.use(express.json())
// обработка роутов
app.use('/promo', router)

app.get('*', (req, res) => {
    res.send('Only /promo endpoint is available.')
})


// обработка ошибок
app.use((err, req, res, next) => {
    console.log(err)
    const status = err.status || 500
    const message = err.message || 'Something went wrong. Try again later'
    res.status(status).json({ message })
})

// запуск сервера
app.listen(8080, () => {
    console.log('🚀 Server ready')
})