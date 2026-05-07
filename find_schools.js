const fs = require('fs');
const schools = JSON.parse(fs.readFileSync('schools.json', 'utf8'));

const targets = ['NAHPI', 'NURSING', 'MEDICINE', 'COLLEGE OF TECHNOLOGY', 'COLTECH', 'SRN'];
const found = schools.filter(s => 
  targets.some(t => s.n.toUpperCase().includes(t) || (s.acr && s.acr.toUpperCase().includes(t)))
);

console.log(JSON.stringify(found, null, 2));
