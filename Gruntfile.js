"use strict";

module.exports = function(grunt) {
	grunt.initConfig({
		uglify : {
			standalone : {
				files : {
					'way.min.js' : [ 'way.js' ]
				}
			}
		},
		watch : {
			files : ['way.js'],
			tasks : ['uglify']
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['uglify:standalone', 'watch' ]);
};
