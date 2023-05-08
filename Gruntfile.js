module.exports = function (grunt) {
  var pkg = grunt.file.readJSON("package.json");
  grunt.initConfig({
    clean: { folder: ["gruntTask/", "dist/"] },
    concat: {
      options: {
        separator: ";",
      },
      dist: {
        src: ["src/js/create-team.js", "src/js/testmodule.js"],
        dest: "gruntTask/concat/app.js",
      },
    },

    uglify: {
      dist: {
        files: [
          {
            // 出力ファイル: 元ファイル
            "dist/app-min.js": "gruntTask/concat/app.js",
          },
        ],
      },
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ["node_modules/jquery-ui/dist/jquery-ui.min.js"],
            dest: "dist/",
          },
          {
            expand: true,
            flatten: true,
            src: ["node_modules/jquery/dist/jquery.min.js"],
            dest: "dist/",
          },
          {
            expand: true,
            flatten: true,
            src: ["node_modules/jquery-ui/dist/themes/base/jquery-ui.min.css"],
            dest: "dist/",
          },
          {
            expand: true,
            flatten: true,
            src: ["src/html/*"],
            dest: "dist/",
          },
          {
            expand: true,
            flatten: true,
            src: ["src/css/*"],
            dest: "dist/",
          },
          {
            expand: true,
            flatten: true,
            src: ["src/json/*"],
            dest: "dist/",
          },
        ],
      },
    },

    watch: {
      js: {
        files: [
          "src/js/*.js",
          "src/html/*.html",
          "src/css/*.css",
          "src/json/*.json",
        ],
        tasks: ["clean", "concat", "uglify", "copy"],
      },
    },
  });

  // プラグインのロード・デフォルトタスクの登録
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.registerTask("default", ["clean", "concat", "uglify", "copy"]);
};
