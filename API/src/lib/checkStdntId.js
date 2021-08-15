// checkStdntId
var checkStdntId = (stdntId) => {
    // check stdntId lenth
    if (stdntId.length !== 5) {
        return 'too long';
    }


    // check string
    let numbers = '1234567890';

    var i = 0;
    while (i < stdntId.length) {
        if (!numbers.includes(stdntId[i])) {
            return 'format type error';
        }
        i++;
    }

    let grade = stdntId[0];
    if (!'123'.includes(grade)) {
        return 'grade error';
    }

    let cl = stdntId[2];
    if (!'123456789'.includes(cl)) {
        return 'class error';
    }

    let num = parseInt(`${stdntId[3]}${stdntId[4]}`);
    if (!(1 <= num <= 35)) {
        return 'num error';
    }

    return '';
}

exports.checkStdntId = checkStdntId;
