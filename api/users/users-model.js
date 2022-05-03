const db = require('../../data/dbConfig')

function getAll(){
    return db('users')
}

function getById(id){
    return db('users').where('id', id).first()
}

async function insert(user){
    const [id] = await db('users').insert(user)
    return getById(id)
}

async function update(id, changes) {
    await db('users')
      .update({ name: changes.name })
      .where('id', id); 
    return getById(id);
  }
  
  async function remove(id) {
    const result = await getById(id);
    await db('users')
      .where('id', id)
      .del();
    
    return result;
  }

module.exports = {
    getAll,
    getById,
    insert,
    update,
    remove
}