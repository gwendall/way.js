"use strict";

module.exports = function(grunt) {
	grunt.initConfig({
		concat : {
			bundle : {
				src : [
					'vendor/jquery.js',
					'vendor/underscore.js',
					'vendor/underscore.json.js',
					'vendor/js2form.js',
					'vendor/form2js.js',
					'way.js'
				],
				dest : 'way.bundle.js'
	        }
	    },
		uglify : {
			bundle : {
				files : {
					'way.bundle.min.js' : [ 'way.bundle.js' ]
				}
			},
			standalone : {
				files : {
					'way.min.js' : [ 'way.js' ]
				}
			}
		},
		watch : {
			files : ['way.js', 'vendor/**/*'],
			tasks : ['concat', 'uglify']
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['concat:bundle', 'uglify:bundle', 'uglify:standalone', 'watch' ]);
};