class Event {
  constructor(id, name, date, description = '') {
    this.id = id;
    this.name = name;
    this.date = date;
    this.description = description;
  }
}

module.exports = Event;
