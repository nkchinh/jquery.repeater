module.exports = function (grunt) {
	const bannerTemplate = ''
        + '// <%= pkg.name %> version <%= pkg.version %>\n'
        + '// <%= pkg.repository.url %>\n'
        + '// (<%= pkg.license %>) <%= grunt.template.today("dd-mm-yyyy") %>\n'
        + '// <%= pkg.author %>\n';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		preprocess: {
			options: {
				context: {
					DEBUG: true,
				},
			},
			test: {
				src: 'test/index.pre.html',
				dest: 'test/index.html',
			},
			index: {
				src: 'index.pre.html',
				dest: 'index.html',
			},
		},

		concat: {
			options: {
				separator: '\n',
				banner: bannerTemplate,
			},
			dist: {
				src: [
					'libs/jquery.input.js',
					'<%= pkg.name %>.js',
				],
				dest: '<%= pkg.name %>.full.js',
			},
		},

		uglify: {
			options: { banner: bannerTemplate },
			dist: {
				files: { '<%= pkg.name %>.full.min.js': ['<%= concat.dist.dest %>'] },
			},
		},

		qunit: {
			// http://stackoverflow.com/questions/22409002/qunitphantomjs-ajax-success-handler-not-called-in-grunt-using-qunit-with-phant
			options: {
				'--web-security': false,
				'--local-to-remote-url-access': true,
			},
			all: ['test/index.html'],
		},

		watch: {
			scripts: {
				files: ['**/*'],
				tasks: ['preprocess', 'concat', 'uglify', 'qunit'],
				options: { spawn: true },
			},
		},

	});

	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// grunt.loadNpmTasks('grunt-contrib-qunit');

	grunt.registerTask('default', ['preprocess', 'concat', 'uglify'/* , 'qunit' */]);
	grunt.registerTask('test', ['preprocess', 'concat', 'uglify', 'qunit']);
};
