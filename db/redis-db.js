const {createClient} = require('redis')


const client = await createClient()
.on('error',()=>{
    console.error('Err connecting Redis')
})

module.exports = client