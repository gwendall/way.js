module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json')
	  , less : {
			development: {
				options: {
					compress: true
				  , yuicompress: true
				  , optimization: 2
				}
			  , files: [
					{ 'public/styles/less.css' : 'public/styles/files/*.less' }
				  , { 'public/styles/_extension.css' : 'app/extension/chrome/package/styles/_start.less' }
				]
			}
		}
	  , html2js : {
			options: {
				base : './public'
			}
		  , main: {
				src: ['public/templates/**/*.html']
			  , dest: 'public/js/files/templates.js'
			}
		}
	  , concat : {
			/*
			less : {
				src : [
					'public/styles/files/*.less'
				]
			  , dest : 'public/styles/concat.less'				
			}
			*/
			css : {
				src : [
				  	'public/libs/ngDialog/css/ngDialog.css'
				  , 'public/libs/ngDialog/css/ngDialog-theme-default.css'
				  , 'public/libs/ngDialog/css/ngDialog-theme-plain.css'
				  , 'public/libs/ngDialog/css/ngDialog-theme-flat.css'
				  , 'public/libs/ngDialog/css/ngDialog-theme-custom.css'
				  , 'public/libs/mCustomScrollbar/mCustomScrollbar.css'
				  , 'public/styles/less.css'
				]
			  , dest : 'public/styles/main.css'
	        }
		  , js : {
				src : [

					'public/libs/jquery.min.js'
				  , 'public/libs/jquery-ui.min.js'
				  , 'public/libs/jquery-ui.autocomplete.html.js'
				
				  , 'public/libs/less.js'
				  , 'public/libs/underscore.js'
				  , 'public/libs/snap/snap.js'
				  , 'public/libs/moment.min.js'
				  , 'public/libs/fastclick.js'
				
				  , 'public/libs/angular/angular-file-upload-shim.min.js'
				  , 'public/libs/angular/angular.min.js'
				  , 'public/libs/angular/angular-file-upload.min.js'
				  , 'public/libs/angular/angular-animate.min.js'
				  , 'public/libs/angular/angular-sanitize.min.js'
				  , 'public/libs/angular/angular-local-storage.min.js'
				  , 'public/libs/angular/angular-resource.min.js'
				  , 'public/libs/angular/angular-touch.min.js'
				  , 'public/libs/angular/angular-socket.js'
				  , 'public/libs/angular/angular-leaflet.js'
				  , 'public/libs/angular/angular-ui-bootstrap.min.js'
				  , 'public/libs/angular/angular-ui-event.min.js'
				  , 'public/libs/angular/angular-ui-router.min.js'
				  , 'public/libs/angular/angular-ui-select2.js'
				  , 'public/libs/angular/angular-scrollto.js'
				  , 'public/libs/angular/angular-deckgrid.js'
				  , 'public/libs/angular/angular-moment.min.js'

				  , 'public/libs/select2/select2.min.js'
				  , 'public/libs/ngDialog/js/ngDialog.min.js'
				  , 'public/libs/mCustomScrollbar/mCustomScrollbar.min.js'
				  , 'public/libs/bootstrap/js/bootstrap.min.js'

				  , 'public/libs/leaflet/leaflet.js'
				  , 'public/libs/leaflet-markercluster/leaflet.markercluster.js'
				
				  , 'public/js/files/templates.js'
				  , 'public/js/files/app.js'
				  , 'public/js/files/routes.js'
				  , 'public/js/files/controllers/*'
				  , 'public/js/files/directives/*'
				  , 'public/js/files/filters/*'
				  , 'public/js/files/resources/*'

				]
			  , dest : 'public/js/main.min.js'
	        }
	    }
	  , cssmin : {
			css : {
				src : 'public/styles/main.less'
			  , dest : 'public/styles/main.min.less'
			}
		}
	  , uglify : {
			js : {
				files : {
	//				'public/js/main.min.js' : [ 'public/js/main.min.js' ]
				}
			}
		}
	  , watch : {
			files : ['public/js/files/**/*', 'public/styles/files/**/*', 'public/libs/**/*', 'public/templates/**/*']
		  , tasks : ['less', 'html2js', 'concat', 'cssmin', 'uglify']
		  , options : {
				// livereload : true
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.registerTask('default', [ 'less', 'concat:css', 'html2js', 'concat:js', 'cssmin:css', 'uglify:js', 'watch' ]);
};