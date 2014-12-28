'use strict';

var _         = require( 'lodash' ),
    Role      = require( './role' ),
    documents = [
        {
            '_id':         '53ff92f6dc52d7472e074815',
            'name':        'GUEST',
            'description': 'If not logged in, every user is a guest.'
        },
        {
            '_id':         '53ff92f6dc52d7472e074816',
            'name':        'USER',
            'description': 'Every user inherits from this role.'
        },
        {
            '_id':         '53ff92f6dc52d7472e074817',
            'name':        'MANAGER',
            'description': 'Petsitters are like regular users, but they have their petsitting tools.',
            'parent':      '53ff92f6dc52d7472e074816'
        },
        {
            '_id':         '53ff92f6dc52d7472e074818',
            'name':        'ADMIN',
            'superuser':   true,
            'description': 'System administrators.'
        }
    ],
    roles     = [],
    ids       = {},
    names     = {};

// fetch roles from db
roles = roles.concat( documents );

// static roles
roles.push(
    new Role( {
        name: 'OWNER'
    } )
);

// Create mappings
_.each( roles, function( role ) {
    ids[role._id] = role;
    names[role.name] = role;
} );

/**
 * Normalize input values and returns the specified role
 * @param {String|Object} role
 * @returns {Object} The normalized role
 */
function normalize( role ) {
    if (!role) {
        throw 'Invalid role: ' + role;
    }

    if (!roles) {
        throw 'Roles middleware is not ready';
    }

    if (_.isString( role )) {
        // Evaluate as ID
        if (ids[role]) {
            return ids[role];
        }
        // Evaluate as name
        if (names[role.toUpperCase()]) {
            return names[role.toUpperCase()];
        }
    }

    if (_.isObject( role )) {
        // Evaluate as native MongoDB ObjectID
        if (role.toString && ids[role.toString()]) {
            return ids[role.toString()];
        }

        // Evaluate as object with id.toString()
        if (role._id && role._id.toString && ids[role._id.toString()]) {
            return ids[role._id.toString()];
        }

        // Evaluate as object with id
        if (role._id && ids[role._id]) {
            return ids[role._id];
        }

        // Evaluate as object with name
        if (role.name && names[role.name]) {
            return names[role.name];
        }
    }
}

/**
 * Get role by ID, name or the role object itself.
 * Use this method to normalize access to roles.
 * @param {String|Object} role
 * @return {Object}
 */
function get( role ) {
    try {
        return normalize( role );
    } catch (err) {
        console.error( 'Cannot get role: ' + err.message );
    }

    return null;
}

module.exports = {
    get: get
};