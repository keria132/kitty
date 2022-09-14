//Plugins for the project

const gulp = require('gulp');
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel");
const autoprefixer = require("gulp-autoprefixer");
const cleanCss = require("gulp-clean-css");
const less = require("gulp-less");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const inject = require('gulp-inject');

//Browsersync settings

function sync(cd){

	browserSync.init({

		server: {
			baseDir: './src/'
		},
		port: 1030
    })
    
	cd();
}

function browserReload(done) {
    browserSync.reload();
    done();
}

//Less conversion

function lessConvert(cd){
    gulp.src('./src/less/**/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(cleanCss({compatibility: 'ie8'}))
    .on('error', console.error.bind(console))
    .pipe(autoprefixer(
        ['> 1%',
        'last 2 versions',
        'firefox >= 4',
        'safari 7',
        'safari 8',
        'IE 8',
        'IE 9',
        'IE 10',
        'IE 11'],
    { cascade: false }))
    .pipe(rename({suffix: '.min'}) )
    .pipe(sourcemaps.write('.') )
    .pipe(gulp.dest('./src/css/') )
    .pipe(browserSync.stream() );

    cd();
}

//Javascript conversion

function javascript(cd){
    gulp.src("./src/js/*.js")
    .pipe(sourcemaps.init())
    // .pipe(babel({
    //     presets: ['@babel/env']
    // }))
    .pipe(uglify())
    //.pipe(concat("bundle.min.js"))
    .pipe(rename({suffix: '.min'}) )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest("./src/js/min/"))
    .pipe(browserSync.stream())

    cd();
}

//Watch for files changes
function watchFiles(){
	gulp.watch('./src/*.html', browserReload);
	gulp.watch('./src/js/*.js', javascript);
    gulp.watch('./src/less/*.less', lessConvert);
}

//Build production version

function build(cb){

	gulp.src('./src/less/**/*.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(cleanCss({compatibility: 'ie8'}))
		.on('error', console.error.bind(console))
		.pipe(autoprefixer(
						['> 1%',
                        'last 2 versions',
                        'firefox >= 4',
                        'safari 7',
                        'safari 8',
                        'IE 8',
                        'IE 9',
                        'IE 10',
                        'IE 11'],
			{ cascade: false }))
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('./') )
		.pipe(gulp.dest('./build/css/'));

	gulp.src('./src/js/script.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./build/js/'));

	gulp.src('./src/img/*.*')
		.pipe( gulp.dest('./build/img'));
		
	gulp.src('./src/index.html')
			//.pipe( inject(gulp.src(['./build/js/*.js', './build/css/*.css'], {read: false})) )
			.pipe( gulp.dest('./build/') );
	
	cb();
}

//Create project structure

function dirs(cb){

    gulp.src("*.*", {read: false})
    .pipe(gulp.dest("./build/"))
    .pipe(gulp.dest("./src/css/"))
    .pipe(gulp.dest("./src/sass/"))
    .pipe(gulp.dest("./src/less/"))
    .pipe(gulp.dest("./src/js/"))
    .pipe(gulp.dest("./src/ts/"))
    .pipe(gulp.dest("./src/img/"))
    .pipe(gulp.dest("./src/libs/"));

    cb();
}

exports.default = gulp.parallel(sync, watchFiles);
exports.css = lessConvert;
exports.js = javascript;
exports.build = build;
exports.dirs = dirs;
