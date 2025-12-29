const assert = require('assert');
const { validateCheckIn, validateCheckOut } = require('../src/validators/attendanceCategory.validator');

function expectBadRequest(fn, name) {
    try {
        fn();
        console.error('[FAIL]', name, 'did not throw');
        process.exit(2);
    } catch (e) {
        if (e.status !== 400) {
            console.error('[FAIL]', name, 'threw but status !== 400', e);
            process.exit(3);
        }
    }
}

expectBadRequest(() => validateCheckIn({}), 'validateCheckIn missing category');
expectBadRequest(() => validateCheckOut({}), 'validateCheckOut missing category');

console.log('Validator tests passed');
process.exit(0);