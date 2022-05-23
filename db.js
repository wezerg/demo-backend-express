class DbSet{
    constructor(collectionName) {
      this.collectionName = collectionName;
      this.memoryDb = new Map();
      this.id = 0;
    }
    getAll() {
      return Object.fromEntries(this.memoryDb);
    }
}
  
module.exports = DbSet;