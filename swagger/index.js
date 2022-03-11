const { join, dirname } = require('path')
const { fileURLToPath } = require('url')
const swaggerAutogen = require('swagger-autogen')

const _dirname =__dirname
//C:\OpenServer\domains\express-server
const doc = {
    // общая информация
    info: {
        title: 'Promotions API',
        description: 'New api for manage promotions API'
    },
    // что-то типа моделей
    definitions: {
        // модель продуктов
        Promotion: {
            id: '1',
            name: 'name',
            decription:'decription',
            participants:[],
            prizes:[]
        },
        // модель массива
        Promotions: [
            {
                // ссылка на модель
                $ref: '#/definitions/Promotion'
            }
        ],
        // модель объекта с текстом новой задачи
        Newpromo: {
            name: 'name',
            decription:'decription'
        },
        Participant:{
            id: '1',
            name: 'name'
        },
        Newparticipant:{
            name: 'name',
        },
        Prize:{
            id: '1',
            decription:'decription'
        },
        Newprize:{
            decription:'decription'
        },
        Winner:{
            id: '1',
            winner: {$ref: '#/definitions/Participant'},
            prize:{$ref: '#/definitions/Prize'}
        },
        Winners:{
            $ref: '#/definitions/Winner'
        },
        // модель объекта с изменениями существующей задачи
        Changes: {
            changes: {
                name: 'name',
                decription:'decription'
            }
        }
    },
    host: 'localhost:8080',
    schemes: ['http']
}

// путь и название генерируемого файла
const outputFile = join(_dirname, 'output.json')
// массив путей к роутерам
const endpointsFiles = [join(_dirname, '../server.js')]

swaggerAutogen(/*options*/)(outputFile, endpointsFiles, doc).then(({ success }) => {
    console.log(`Generated: ${success}`)
})