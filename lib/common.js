'use strict';


module.exports = {

    getHomePath: function () {

        /* $lab:coverage:off$ */
        return process.env.HOME ? process.env.HOME : `${process.env.HOMEDRIVE}${process.env.HOMEPATH}`;
        /* $lab:coverage:on$ */
    }
};
