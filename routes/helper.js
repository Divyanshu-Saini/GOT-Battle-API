const GotDocument = require('../models/GotModel');

const buildSearchQuery = (keys, query) => {
    let serchQuery = [];
    // for kings
    if (keys.includes('king')) {
        let queryBuilder = {
            $or: [{
                'attacker_king': query.king
            }, {
                'defender_king': query.king
            }]
        }
        serchQuery.push(queryBuilder);
    }

    // for location
    if (keys.includes('location')) {
        let queryBuilder = {
            'location': query.location
        };
        serchQuery.push(queryBuilder);
    }

    // for battle type
    if (keys.includes('type')) {
        let queryBuilder = {
            'battle_type': query.type
        };
        serchQuery.push(queryBuilder);
    }

    return serchQuery
}

module.exports = {
    buildSearchQuery,
}