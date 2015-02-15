module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        as : grunt.file.readJSON('alias.json'),
     transport: {
            options : {
                paths: ['./'],
                alias: '<%= as.spm.alias %>'
            },

            //feedback
            loop: {
                files : [
                    {
                        expand: true,
                        cwd :  "./",
                        src : [
                            "modules/core/jquery/1.9.1/jquery.js",
                            "modules/template/artTemplate/template-native.js",
                            "modules/scroll/load/jquery.infinitescroll.js",
                            "modules/util/top/jquery.scrollUp.js",
                            "modules/util/top/headroom.js"
                        ],
                        dest : './build/transport'
                    }
                ]
            }


        },
        concat: {
            options : {
            },
            loop: {
                src  : ["./build/transport/**/*.js","!./build/transport/**/*-debug.js"],
                dest : "./build/publish/main-debug.js"
            }
        },

        uglify : {
            options : {
            },
            loop : {
                src  : "./build/publish/main-debug.js",
                dest : "./build/publish/main.js"
            }
        },
        clean : {
            options : {
            },
            build : {
                src : ['./build/transport']
            }
        }
    });


    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    //测试打包loop
    grunt.registerTask('build', ['transport','concat','uglify','clean']);

};