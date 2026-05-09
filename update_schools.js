/**
 * update_schools.js
 * Applies all required changes to data/schools.json:
 * 1. Fix NAHPI: departments + remove Miscellaneous fee
 * 2. Add full student info fields (O/L & A/L year, school name, POB, division/sub-div/region, sex, nationality, BACC/GCE selector) to ALL schools
 * 3. Add acronyms to school "n" display names
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'schools.json');
let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// ─────────────────────────────────────────────────────────────────────────────
// ACRONYM MAP: school names → acronyms (verified from official sources)
// ─────────────────────────────────────────────────────────────────────────────
const schoolAcronymMap = {
  // University of Bamenda (UID 0)
  'College of Technology': 'COLTECH',
  'National Higher Polytechnic Institute': 'NAHPI',
  'Faculty of Sciences': 'FS',
  'Faculty of Arts': 'FA',
  'Faculty of Education and Management Sciences': 'FEMS',
  'Faculty of Education': 'FED',
  'Higher Institute of Commerce and Management Sciences': 'HICM',
  'Higher Institute of Transport and Logistics': 'HITL',
  'Faculty of Health Sciences': 'FHS',
  'Higher Teachers Training College': 'HTTC',
  'Higher Technical Teacher Training College': 'HTTTC',
  'Faculty of Law and Political Sciences': 'FLPS',
  'State Registered Nursing': 'SRN',
  // University of Buea (UID 1)
  'Faculty of Science': 'FS',
  'Faculty of Social & Management Sciences': 'FSMS',
  'Faculty of Laws & Political Science': 'FLPS',
  // College of Technology Buea = COT (different from COLTECH of UBda)
  // handled specially below
  'Faculty of Engineering & Technology': 'FET',
  'Faculty of Agriculture and Veterinary Medicine': 'FAVM',
  'HTTTC Kumba': 'HTTTC',
  // University of Dschang (UID 4)
  'Faculty of Letters & Social Sciences (FLSH)': 'FLSH',
  'Faculty of Science (FS)': 'FS',
  'Faculty of Laws & Political Science (FSJP)': 'FSJP',
  'Faculty of Economics & Management (FSEG)': 'FSEG',
  'Faculty of Agronomy & Agricultural Sciences (FASA)': 'FASA',
  'IUT Fotso Victor (IUT-FV)': 'IUT-FV',
  'Institute of Fine Arts (IBA - Foumban)': 'IBA',
  'Faculty of Medicine & Pharm. Sciences (FMSP)': 'FMSP',
  // University of Douala (UID 3)
  'Faculty of Letters & Social Sciences': 'FLSH',
  'Faculty of Science': 'FS',
  'Faculty of Laws & Political Science': 'FSJP',
  'Faculty of Economics & Applied Management': 'FSEGA',
  'National Polytechnic School of Douala': 'ENSPD',
  'Higher Schools of Economic and Commercial Sciences': 'ESSEC',
  'Higher Technical Teacher Training College of Douala': 'ENSET',
  'University Institute of Technology of Douala': 'IUT-Douala',
  'Institute of Fine Arts Nkongsamba': 'IBA-Nkongsamba',
  'Institute of Fisheries Science': 'ISH',
  // University of Ngaoundéré (UID 5)
  'Faculty of Arts, Letters and Human Sciences': 'FALSH',
  'Faculty of Sciences': 'FS',
  'Faculty of Economics and Management': 'FSEG',
  'Faculty of Legal and Political Sciences': 'FSJP',
  'University Institute of Technology of Ngaoundere': 'IUT-Ngaoundéré',
  'National School of Agro-Industrial Sciences': 'ENSAI',
  'School of Science and Veterinary Medicine': 'SSVM',
  'School of Geology and Mining of Meiganga': 'ESMM',
  'Chemistry Engineering and Minerals Industries School': 'EGCIM',
  // University of Maroua (UID 6)
  'Faculty of Arts and Humanities': 'FLSH',
  'Faculty of Mines and Petroleum Industries': 'FMIP',
  'Advanced Teacher Training College of Maroua': 'ENS-Maroua',
  'National Advanced School of Engineering of Maroua': 'ENSPM',
  // University of Garoua (UID 10)
  'Faculty of Medicine and Biomedical Sciences': 'FMSB',
  'Faculty of Education Sciences': 'FSE',
  'Institute of Fine Arts and Innovation': 'IBAI',
  // University of Yaoundé I (UID 2)
  'Faculty of Medicine and Biomedical Sciences': 'FMSB',
  'Advanced Teacher Training College of Yaounde': 'ENS-Yaoundé',
  'Higher National Polytechnic School of Yaounde': 'ENSPY',
  'University Institute of Wood Technology of Mbalmayo': 'IUT-Bois',
  // University of Yaoundé II (UID 7)
  'Institute of International Relations of Cameroon': 'IRIC',
  'Institute for Demographic Training and Research': 'IFORD',
  'Higher School of Information and Communication Sciences and Techniques': 'ESSTIC',
  // University of Bertoua (UID 8)
  'Institute of Agriculture, Wood, Water and Environment': 'IAFB',
  'Higher Normal School of Technical Education': 'ENSET-Bertoua',
  'Higher School of Transformations of Mines and Energy Resources': 'ESTMRE',
  'Advanced Teacher Training College of Bertoua': 'ENS-Bertoua',
  // University of Ebolowa (UID 9)
  'Faculty of Medicine and Pharmaceutical Sciences': 'FMSP',
  'Higher School of Transport, Logistics and Commerce': 'ESTLC',
  'Advanced Technical Teacher Training College of Ebolowa': 'ENSET-Ebolowa',
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE STUDENT INFO FIELDS (to be prepended/merged into every school's formFields)
// The fields to ADD to every form (that don't already exist):
// ─────────────────────────────────────────────────────────────────────────────
const coreStudentFields = [
  { key: 'fullName',       label: 'Full Names (as on Birth Certificate)',  type: 'text',   placeholder: 'e.g. Ngounou Jean Baptiste'  },
  { key: 'dob',            label: 'Date of Birth',                          type: 'date'   },
  { key: 'pob',            label: 'Place of Birth (as on Birth Certificate)', type: 'text', placeholder: 'e.g. Bamenda' },
  { key: 'sex',            label: 'Sex',                                    type: 'select', options: ['Male', 'Female'] },
  { key: 'nationality',    label: 'Nationality',                            type: 'text',   placeholder: 'e.g. Cameroonian' },
  { key: 'regionOrigin',   label: 'Region of Origin',                       type: 'select',
    options: ['Adamawa','Centre','East','Far North','Littoral','North','North West','South','South West','West'] },
  { key: 'divisionOrigin', label: 'Division of Origin',                     type: 'text',   placeholder: 'e.g. Mezam' },
  { key: 'subDivOrigin',   label: 'Sub-Division of Origin',                 type: 'text',   placeholder: 'e.g. Bamenda I' },
  // Entry certificate type question
  { key: 'entryCertType',  label: 'Entry Certificate Type',                 type: 'select',
    options: ['GCE (General Students)', 'BACC (Technical Students)'] },
  // O/L fields
  { key: 'olYear',         label: 'Year of O/L / BEPC Certificate',         type: 'text',   placeholder: 'e.g. 2021' },
  { key: 'olSchool',       label: 'School Where O/L / BEPC Was Obtained',  type: 'text',   placeholder: 'e.g. GBHS Bamenda' },
  { key: 'olPoints',       label: 'O/L Total Points',                       type: 'number', placeholder: 'e.g. 32' },
  // A/L fields
  { key: 'alYear',         label: 'Year of A/L / BACC Certificate',         type: 'text',   placeholder: 'e.g. 2024' },
  { key: 'alSchool',       label: 'School Where A/L / BACC Was Obtained',  type: 'text',   placeholder: 'e.g. GBHS Bamenda' },
  { key: 'alPoints',       label: 'A/L Total Points',                       type: 'number', placeholder: 'e.g. 14' },
];

// Keys that are part of the core set (for deduplication)
const coreKeys = new Set(coreStudentFields.map(f => f.key));

/**
 * Merge core fields into an existing formFields array.
 * - Core fields go first (in order), deduplicating by key.
 * - Non-core school-specific fields that don't clash are appended after.
 */
function mergeFormFields(existingFields) {
  const existingMap = {};
  for (const f of existingFields) existingMap[f.key] = f;

  // Start with core fields, using existing field data if present (to preserve labels/options)
  const result = coreStudentFields.map(cf => {
    if (existingMap[cf.key]) {
      // Merge: keep the core label/type/options but allow existing placeholder if set
      return { ...cf, ...(existingMap[cf.key].placeholder ? { placeholder: existingMap[cf.key].placeholder } : {}) };
    }
    return { ...cf };
  });

  // Append school-specific fields that are NOT in the core set
  for (const f of existingFields) {
    if (!coreKeys.has(f.key)) {
      result.push(f);
    }
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Process each university group
// ─────────────────────────────────────────────────────────────────────────────
data = data.map(uniGroup => {
  const uid = uniGroup.university_id;

  uniGroup.schools = uniGroup.schools.map(school => {
    // ── 1. Fix NAHPI departments ──────────────────────────────────────────────
    if (school.acr === 'NAHPI' && uid === 0) {
      school.departments = [
        'Chemical & Biological Engineering (CBE)',
        'Civil & Architecture Engineering (CVA)',
        'Computer Engineering (COME)',
        'Electrical & Electronic Engineering (EEE)',
        'Mechanical & Industrial Engineering (MIE)',
        'Mining & Mineral Engineering (MME)',
        'Petroleum Engineering (PE)'
      ];
      // ── 2. Remove Miscellaneous from NAHPI fees ───────────────────────────
      school.schoolRequirements = school.schoolRequirements.filter(
        r => r.label.toLowerCase() !== 'miscellaneous'
      );
    }

    // ── 3. Fix College of Technology – Buea acronym ───────────────────────────
    if (school.n === 'College of Technology' && uid === 1) {
      school.acr = 'COT';
    }

    // ── 4. Add acronym to school name if not already in name ─────────────────
    const acr = school.acr;
    if (acr && !school.n.includes('(')) {
      // Special case: Buea's College of Technology should use COT
      school.n = `${school.n} (${acr})`;
    } else if (!acr) {
      // Schools without acronym – look up in map
      const mappedAcr = schoolAcronymMap[school.n];
      if (mappedAcr) {
        school.n = `${school.n} (${mappedAcr})`;
        school.acr = mappedAcr;
      }
    }

    // ── 5. Update formFields for all schools that have them ──────────────────
    if (Array.isArray(school.formFields) && school.formFields.length > 0) {
      school.formFields = mergeFormFields(school.formFields);
    } else if (!school.formFields) {
      // Schools with no form fields get the core set only
      school.formFields = coreStudentFields.map(f => ({ ...f }));
    }

    return school;
  });

  return uniGroup;
});

// Write back
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('✅ schools.json updated successfully.');
