'use strict';

module.exports = function(grunt) {
    return {
        compile: {
            files: {
                'app/js/templates.js': ['app/templates/**/*.html']
            }
        }
    }
};
