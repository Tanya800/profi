var express = require('express');

const fs = require("fs");

var router = express.Router();


const usersFile = "db/users.json";// бд
const winnersFile = "db/winners.json";// бд
const promotionFile = "db/promotions.json";// бд
const prizesFile = "db/prize.json";// бд

const jsonParser = express.json();

router.post('/', async (req, res, next) => {
    // #swagger.description = 'Create new promotion'
    // тело запроса
    /* #swagger.parameters['name'] = {
      in: 'body',
      description: 'New promotion name',
      type: 'string',
      required: true,
      schema: { $ref: '#/definitions/Newpromo' } ????????????????????????????????????????????????????
    } */
    /* #swagger.parameters['decription'] = {
      in: 'body',
      description: 'New promotion decription',
      type: 'string',
      required: true,
      schema: { $ref: '#/definitions/Newpromo' } ???????????????????????????????????????
    } */
    /* #swagger.responses[201] = {
        description: 'Id of new promotion',
        schema: { $ref: '#/definitions/Promotion' }
    } */

    // код роута
    try {

        const name = req.body.name
        const description = req.body.description

        let data = fs.readFileSync(promotionFile, "utf8");
        let promotions = JSON.parse(data);

        // создаем новый promo
        const newPromotion = {
            id: promotions.length + 1,
            name:name,
            description:description
        }

        // находим максимальный id
        const id = Math.max.apply(Math, promotions.map(function (o) {
            return o.id;
        }))

        // увеличиваем его на единицу
        newPromotion.id = id + 1;
        let tempId = newPromotion.id
        // добавляем пользователя в массив
        promotions.push(newPromotion);
        data = JSON.stringify(promotions);
        // перезаписываем файл с новыми данными
        fs.writeFileSync(promotionFile, data);
        // возвращаем id новой промо
        res.status(201).json(tempId)

    } catch (e) {
        console.log('*** Create promotion')
        next(e)
    }
})

router.get('/', async (req, res, next) => {
    // описание роута
    // #swagger.description = 'Get all promotions without users and prisez'
    // возвращаемый ответ
    /* #swagger.responses[200] = {
        // описание ответа
        description: 'Array of all promotions',
        // схема ответа - ссылка на модель
        schema: { $ref: '#/definitions/Promotions' }
    } */

    // код роута
    try {
        const content = fs.readFileSync(promotionFile, "utf8");
        const promotions = JSON.parse(content);

        if (promotions.length) {
            let array = []
            promotions.forEach(el=>{
                let temp = {}
                temp['id'] = el.id
                temp['name'] = el.name
                temp['description'] = el.description
                array.push(temp)
            })

            // отправляем данные клиенту
            res.status(200).json(array)
        } else {
            // сообщаем об отсутствии задач
            res.status(200).json({message: 'There are no promotions.'})
        }
    } catch (e) {
        // фиксируем локацию возникновения ошибки
        console.log('*** Get all promotions')
        // передаем ошибку обработчику ошибок
        next(e)
    }
})

router.get('/:id', async (req, res, next) => {
    // #swagger.description = 'Get promotion by ID'
    // параметр запроса
    /* #swagger.parameters['id'] = {
      // описание параметра
      description: 'Existing promotion ID',
      type: 'string',
      required: true
    } */
    /* #swagger.responses[200] = {
        description: 'Promotion with provided ID',
        schema: { $ref: '#/definitions/Promotion' }
    } */

    //  код роута
    const id = req.params.id

    try {
        const content = fs.readFileSync(promotionFile, "utf8");
        const promos = JSON.parse(content);

        if (!promos.length) {
            return res.status(400).json({message: 'There are no promotions'})
        }

        let promo = null;
        // находим в массиве продукт по id
        for (var i = 0; i < promos.length; i++) {
            if (promos[i].id == id) {
                promo = promos[i];
                break;
            }
        }

        // если не нашли
        if (!promo) {
            return res
                .status(400)
                .json({message: 'There is no promos with product ID'})
        }

        // если нашли
        res.status(200).json(promo)

    } catch (e) {
        console.log('*** Get promo by ID')
        next(e)
    }
})

router.put('/:id', async (req, res, next) => {
    // #swagger.description = 'Update existing promotion'
    /* #swagger.parameters['id'] = {
      description: 'Existing promotion ID',
      type: 'string',
      required: true
    } */
    /* #swagger.parameters['name'] = {
      in: 'body',
      description: 'New promotion name',
      type: 'string',
      required: true,
      schema: { $ref: '#/definitions/Newpromo' } ????????????????????????????????????????????????????
    } */
    /* #swagger.parameters['decription'] = {
      in: 'body',
      description: 'New promotion decription',
      type: 'string',
      required: true,
      schema: { $ref: '#/definitions/Newpromo' } ???????????????????????????????????????
    } */
    /* #swagger.responses[201] = {
      description: 'New promo',
      schema: { $ref: '#/definitions/Promotion' }
    } */

    // код promo
    const id = req.params.id

    if (!id) {
        return res
            .status(400)
            .json({message: 'Existing promo ID must be provided'})
    }

    const name = req.body.name;
    const description = req.body.description;

    let data = fs.readFileSync(promotionFile, "utf8");
    const promotions = JSON.parse(data);
    let promo;
    for (var i = 0; i < promotions.length; i++) {
        if (promotions[i].id == id) {
            promo = promotions[i];
            break;
        }
    }
    // изменяем данные у promo
    if (promo) {
        promo.name = name;
        promo.description = description;

        data = JSON.stringify(promotions);
        fs.writeFileSync(promotionFile, data);
        res.status(201).json(promo)
    } else {
        return res
            .status(400)
            .json({message: 'There is no promo with provided ID'})
    }

})

router.delete('/:id', async (req, res, next) => {
    // #swagger.description = 'Remove existing promotion'
    /* #swagger.parameters['id'] = {
      description: 'Existing promotion ID',
      type: 'string',
      required: true
    } */
    /* #swagger.responses[201] = {
      description: 'Array of new promotions or empty array',
      schema: { $ref: '#/definitions/Promotions' }
    } */

    // код promo
    const id = req.params.id

    if (!id) {
        return res
            .status(400)
            .json({message: 'Existing promotion ID must be provided'})
    }

    let data = fs.readFileSync(promotionFile, "utf8");
    let promotions = JSON.parse(data);
    let index = -1;
    // находим индекс продукта в массиве
    for (var i = 0; i < promotions.length; i++) {
        if (promotions[i].id == id) {
            index = i;
            break;
        }
    }

    if (index > -1) {
        // удаляем пользователя из массива по индексу
        const product = promotions.splice(index, 1)[0];
        data = JSON.stringify(promotions);
        fs.writeFileSync(promotionFile, data);
        // отправляем
        res.status(201).json(promotions)
    } else {
        return res
            .status(400)
            .json({message: 'There is no promotion with provided ID'})
    }
})

router.post('/:id/participant', async (req, res, next) => {
    // #swagger.description = 'Create new participant in promotion'
    // тело запроса
    /* #swagger.parameters['name'] = {
      in: 'body',
      description: 'New participant name',
      type: 'string',
      required: true,
      schema: { $ref: '#/definitions/Newparticipant' } ????????????????????????????????????????????????????
    } */
    /* #swagger.responses[201] = {
        description: 'Id of new participant',
        schema: { $ref: '#/definitions/Participant' }
    } */
    const id = req.params.id
    // код роута
    try {

        const name = req.body.name

        let data = fs.readFileSync(promotionFile, "utf8");
        let promotions = JSON.parse(data);

        let usFile = fs.readFileSync(usersFile, "utf8");
        let users = JSON.parse(usFile);

        let user = null;
        // находим в массиве users по name
        for (var i = 0; i < users.length; i++) {
            if (users[i].name == name) {
                user = users[i];
                break;
            }
        }
        // если не нашли
        if (!user) {
            const newUser ={
                id:users.length + 1,
                name:name
            }
            // находим максимальный id
            const idU = Math.max.apply(Math, users.map(function (o) {
                return o.id;
            }))

            // увеличиваем его на единицу
            newUser.id = idU + 1;

            // добавляем пользователя в массив
            users.push(newUser);
            let dataUsers = JSON.stringify(users);
            // перезаписываем файл с новыми данными
            fs.writeFileSync(usersFile, dataUsers);

            user = newUser
        }

        let index = null;
        // находим в массиве продукт по id
        for (var i = 0; i < promotions.length; i++) {
            if (promotions[i].id == id) {
                index = i;
                break;
            }
        }

        // если не нашли
        if (!index) {
            return res
                .status(400)
                .json({message: 'There is no promos with ID'})
        }
        if(!promotions[index].hasOwnProperty('participants')){
            promotions[index]['participants'] = []
        }
        promotions[index].participants.push(user)

        data = JSON.stringify(promotions);
        // перезаписываем файл с новыми данными
        fs.writeFileSync(promotionFile, data);
        // возвращаем id новой промо
        res.status(201).json(user.id)

    } catch (e) {
        console.log('*** Create participant')
        next(e)
    }
})

router.delete('/:id/participant/:idpatricioant', async (req, res, next) => {
    // #swagger.description = 'Remove existing patricioant'
    /* #swagger.parameters['id'] = {
      description: 'Existing promotion ID',
      type: 'string',
      required: true
    } */
    /* #swagger.parameters['idpatricioant'] = {
      description: 'Existing patricioant ID',
      type: 'string',
      required: true
    } */
    /* #swagger.responses[201] = {
      description: 'Array of new promotions or empty array',
      schema: { $ref: '#/definitions/Promotions' }
    } */

    // код promo
    const id = req.params.id
    const participantId = req.params.idpatricioant

    if (!id) {
        return res
            .status(400)
            .json({message: 'Existing promotions ID must be provided'})
    }

    let data = fs.readFileSync(promotionFile, "utf8");
    let promotions = JSON.parse(data);

    let index = -1;
    // находим индекс продукта в массиве
    for (var i = 0; i < promotions.length; i++) {
        if (promotions[i].id == id) {
            index = i;
            break;
        }
    }

    if (index > -1) {

        let usFile = fs.readFileSync(usersFile, "utf8");
        let users = JSON.parse(usFile);

        let user = null;
        let indexUser = null;
        // находим в массиве users по name
        for (var i = 0; i < users.length; i++) {
            if (users[i].id == participantId) {
                user = users[i];
                indexUser = i;
                break;
            }
        }
        // если не нашли
        if (!user) {
            return res
                .status(400)
                .json({message: 'There is no users in  promo with provided ID'})
        }
        let temp = promotions[index].participants
        let tempIndex = temp.findIndex(i => i.id == participantId)
        delete promotions[index].participants[tempIndex]

        // удаляем пользователя из массива по индексу
        // const product = promotions.splice(index, 1)[0];

        data = JSON.stringify(promotions);
        fs.writeFileSync(promotionFile, data);
        // отправляем
        res.status(201).json(promotions[index])
    } else {
        return res
            .status(400)
            .json({message: 'There is no promotion with provided ID'})
    }
})

router.post('/:id/prize', async (req, res, next) => {
    // #swagger.description = 'Create new participant in promotion'
    // тело запроса
    /* #swagger.parameters['description'] = {
      in: 'body',
      description: 'New prize description',
      type: 'string',
      required: true,
      schema: { $ref: '#/definitions/Newprize' } ????????????????????????????????????????????????????
    } */
    /* #swagger.responses[201] = {
        description: 'Id of new prize',
        schema: { $ref: '#/definitions/Prize' }
    } */
    const idPromo = req.params.id
    // код роута
    try {

        const description = req.body.description

        let data = fs.readFileSync(promotionFile, "utf8");
        let promotions = JSON.parse(data);

        let prFile = fs.readFileSync(prizesFile, "utf8");
        let prizes = JSON.parse(prFile);

        let prize = null;
        // находим в массиве prize по description
        for (var i = 0; i < prizes.length; i++) {
            if (prizes[i].description == description) {
                prize = prizes[i];
                break;
            }
        }
        // если не нашли
        if (!prize) {
            const newPrize ={
                id:prizes.length + 1,
                description:description
            }
            // находим максимальный id
            const idU = Math.max.apply(Math, prizes.map(function (o) {
                return o.id;
            }))

            // увеличиваем его на единицу
            newPrize.id = idU + 1;

            // добавляем пользователя в массив
            prizes.push(newPrize);

            let dataPrizes = JSON.stringify(prizes);
            // перезаписываем файл с новыми данными
            fs.writeFileSync(prizesFile, dataPrizes);

            prize = newPrize
        }

        let index = -1;
        // находим в массиве продукт по id
        for (var i = 0; i < promotions.length; i++) {
            if (promotions[i].id == idPromo) {
                index = i;
                break;
            }
        }

        // если не нашли
        if (index===-1) {
            return res
                .status(400)
                .json({message: 'There is no promos with ID'})
        }

        if(!promotions[index].hasOwnProperty('prizes')){
            promotions[index]['prizes'] = []
        }
        promotions[index].prizes.push(prize)

        data = JSON.stringify(promotions);
        // перезаписываем файл с новыми данными
        fs.writeFileSync(promotionFile, data);
        // возвращаем id новой промо
        res.status(201).json(prize.id)

    } catch (e) {
        console.log('*** Create participant')
        next(e)
    }
})

router.delete('/:id/prize/:idprize', async (req, res, next) => {
    // #swagger.description = 'Remove existing prize'
    /* #swagger.parameters['id'] = {
      description: 'Existing promotion ID',
      type: 'string',
      required: true
    } */
    /* #swagger.parameters['idprize'] = {
      description: 'Existing prize ID',
      type: 'string',
      required: true
    } */
    /* #swagger.responses[201] = {
      description: 'Array of new promotions or empty array',
      schema: { $ref: '#/definitions/Promotions' }
    } */

    // код promo
    const id = req.params.id
    const prizeId = req.params.idprize

    if (!id) {
        return res
            .status(400)
            .json({message: 'Existing promotions ID must be provided'})
    }

    let data = fs.readFileSync(promotionFile, "utf8");
    let promotions = JSON.parse(data);

    let index = -1;
    // находим индекс продукта в массиве
    for (var i = 0; i < promotions.length; i++) {
        if (promotions[i].id == id) {
            index = i;
            break;
        }
    }

    if (index > -1) {

        let prFile = fs.readFileSync(prizesFile, "utf8");
        let prizes = JSON.parse(prFile);

        let prize = null;

        // находим в массиве users по name
        for (var i = 0; i < prizes.length; i++) {
            if (prizes[i].id == prizeId) {
                prize = prizes[i];

                break;
            }
        }
        // если не нашли
        if (!prize) {
            return res
                .status(400)
                .json({message: 'There is no prize in  promo with provided ID'})
        }

        let temp = promotions[index].prizes
        let tempIndex = temp.findIndex(i => i.id == prizeId)
        delete promotions[index].prizes[tempIndex]


        data = JSON.stringify(promotions);
        fs.writeFileSync(promotionFile, data);
        // отправляем
        res.status(201).json(promotions[index])
    } else {
        return res
            .status(400)
            .json({message: 'There is no promotion with provided ID'})
    }
})

router.post('/:id/raffle', async (req, res, next) => {
    // #swagger.description = 'Create new winners in promotion'
    // тело запроса
    /* #swagger.parameters['id'] = {
      description: 'Existing promotion ID',
      type: 'string',
      required: true
    } */
    /* #swagger.responses[201] = {
        description: 'Array of new winners',
        schema: { $ref: '#/definitions/Winners' }
    } */
    const id = req.params.id
    // код роута
    try {

        let data = fs.readFileSync(promotionFile, "utf8");
        let promotions = JSON.parse(data);

        let index = null;
        // находим в массиве продукт по id
        for (var i = 0; i < promotions.length; i++) {
            if (promotions[i].id == id) {
                index = i;
                break;
            }
        }

        // если не нашли
        if (!index) {
            return res
                .status(400)
                .json({message: 'There is no promos with ID'})
        }

        const promoPrizes = promotions[index].prizes
        const promoParticipants = promotions[index].participants

        if (promoPrizes.length !== promoParticipants.length){
            return res
                .status(409)
                .json({message: 'Cannot create winners at the moment'})
        }

        let arrayWinners = []

        promoPrizes.forEach((el,i)=>{

            const newWinners ={
                id:arrayWinners.length + 1,
                prize:el,
                winner:promoParticipants[i],
            }

            arrayWinners.push(newWinners)
        })

        let dataWinners = JSON.stringify(arrayWinners);
        // перезаписываем файл с новыми данными
        fs.writeFileSync(winnersFile, dataWinners);

        // возвращаем
        res.status(201).json(arrayWinners)

    } catch (e) {
        console.log('*** Create winners')
        next(e)
    }
})

// --------------------------------------------------------------------------------------------------------------------------------

module.exports = router;