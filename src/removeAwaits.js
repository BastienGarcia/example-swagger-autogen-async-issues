/*
    - Could be added to handle-data.js, and used in handle-file.js around line 87 -
    let aData = await handleData.removeComments(dataSrc, true);
    aData = await handleData.clearData(aData);
    let converted = await handleData.dataConverter(aData);
    aData = converted.data;
>>> aData = await handleData.removeAwaits(aData); <<<
    patternsServer = converted.patterns;

*/


/**
 * Remove the await keyword in a string, except in comments and substrings.
 * @param {string} data file content.
 */
function removeAwaits(data) {
    return new Promise(resolve => {
        if (!data || data.length === 0) {
            return resolve(data);
        }

        let isStr = 0;
        const strDelimiters = '\'"`'
        for (let idx = 0; idx < data.length; idx += 1) {
            // Check if current character is a string delimiter
            if (strDelimiters.includes(data[idx])) {
                currentDelimiter = strDelimiters.indexOf(data[idx]) + 1;
                if (isStr === 0) {
                    // If not in a string, set state as "in string using specific delimiter"
                    isStr = currentDelimiter;
                } else if (isStr === currentDelimiter && (data[idx - 1] !== '\\' || data[idx - 2] === '\\')) {
                    // If in a string, set state as "not in a string"
                    isStr = 0;
                }
            }
            // If in string, skip current index
            if (isStr !== 0) continue;
            // Skip comments
            if (data.slice(idx, idx + 2) === '/*') {
                while (data.slice(idx, idx + 2) !== '*/' && idx < data.length) idx += 1;
                continue;
            }
            // Remove await keyword
            if (data.slice(idx, idx + 6) === 'await ') {
                data = data.slice(0, idx) + data.slice(idx + 6);
                idx -= 1;
                continue;
            }
        }
        resolve(data);
    });
}