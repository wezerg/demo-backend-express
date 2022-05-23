class DbSet{
    constructor(dbSet) {
      this.dbSet = dbSet;
      this.memoryDb = new Map();
      this.id = 0;
    }
    getAll() {
        return Object.fromEntries(this.memoryDb);
    }
    get(id) {
        if (this.exists(id)) {
            return this.memoryDb.get(id);
        } else {
            throw new Error(`Key ${id} doesn't not exists`);
        }
    }
    insert(obj) {
        this.memoryDb.set(this.id, obj);
        return { id: this.id++, inserted: obj };
    }
    exists(id) {
      return this.memoryDb.has(id);
    }
    update(id, obj) {
        if (this.exists(id)) {
            this.memoryDb.set(id, obj);
        } else {
            throw new Error(`Key ${id} doesn't not exists`);
        }
    }
    delete(id) {
        if (this.exists(id)) {
            this.memoryDb.delete(id);
        } else {
            throw new Error(`Key ${id} doesn't not exists`);
        }
    }
    findBy(propertyName, value) {
      let result = false;
      this.memoryDb.forEach((obj, id) => {
        if (!result) {
          if (propertyName in obj && obj[propertyName] === value) {
            result = { id: id, entity: obj };
          }
        }
      });
      return result || {};
    }
}
  
module.exports = DbSet;