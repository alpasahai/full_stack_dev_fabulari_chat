const fs = require('fs');
const path = require('path');

function read_data(filename){
    const file_path = path.join(__dirname, '..', 'data', filename);
    const raw = fs.readFileSync(file_path, 'utf-8');
    return JSON.parse(raw);
}

function write_data(filename, data){
    const file_path = path.join(__dirname, '..', 'data', filename);
    fs.writeFileSync(file_path, JSON.stringify(data, null, 2));
}

module.exports = {
    read_data,
    write_data
};