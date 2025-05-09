import fs from 'fs';
class Users extends Array {
  constructor(path, ...args) {
    super(...args);
    this.path = path;
  }

  push(user) {
    Array.prototype.push.call(this, user);
    console.log(`User added: ${JSON.stringify(user)}`);
    this.save(this.path)
  }
  pop() {
    const user = Array.prototype.pop.call(this);
    console.log(`User removed: ${JSON.stringify(user)}`);
    return user;
  }
  find(callback) {
    const result = Array.prototype.find.call(this, callback);
    if (result) {
      console.log(`User found: ${JSON.stringify(result.username)}`);
    }
    return result;
  }
  fetch() {
    const users = JSON.parse(fs.readFileSync(this.path, 'utf8'));
    Array.prototype.push.call(this, ...users);
  }
  save() {
    fs.writeFileSync(this.path, JSON.stringify(this), 'utf8');
  }
  update(username, data) {
    const user = this.find(user => user.username === username);
    if (user) {
      user.data = data;
      console.log(`${user.username} updated: ${(user.data)}`);
      this.save();
    }
  }
  modifyPassword(username, password) {
    const user = this.find(user => user.username === username);
    if (user) {
      user.password = password;
      console.log(`${user.username} password updated: ${(user.password)}`);
      this.save();
    }
  }
}
export { Users };