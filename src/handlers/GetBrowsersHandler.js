function getBrowsers (cursor, data) {
    cursor.update(c => c
        .set('options', data)
        .set('selection', null)
    );
}

export default {
    getBrowsers
};
