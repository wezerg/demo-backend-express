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
}
  
module.exports = DbSet;