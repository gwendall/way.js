'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    uglify: {
      standalone: {
        files: {
          'dist/way.js': ['src/way.js']
        }
      }
    },
    watch: {
      files: ['src/way.js'],
      tasks: ['uglify']
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['uglify:standalone', 'watch']);
};
