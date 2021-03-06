import babelify   from 'babelify';
import browserify from 'browserify';
import buffer     from 'vinyl-buffer';
import del        from 'del';
import gulp       from 'gulp';
import gulpif     from 'gulp-if';
import source     from 'vinyl-source-stream';
import uglify     from 'gulp-uglify';
import util       from 'gulp-util';
import browserSync from 'browser-sync';

const reload = browserSync.reload;

const config = {
    filename: 'app',
    scripts: {
        input: ['./src/app.js'],
        out: 'dist/',
        watch: ['./src/**/*.js']
    },
    isDev : util.env.dev // Config is dev if the dev flag is passed (gulp --dev)
};

/**
 * Deletes the /dist/ folder
 */
gulp.task('clean', () => {
    del(config.scripts.out);
});


/**
 * Builds all of our scripts
 */
gulp.task('scripts', () => {
    // console.log(CONFIG)

    const entries = config.scripts.input;

    entries.map( (entry) => {
        // Browserfy Object
        const bundler = browserify({
            entries: entry,
            debug: config.isDev
        });

        // Transform through Babel
        bundler.transform( 'babelify', {
            presets: ['es2015']
        });

        return bundler.bundle().on('error', (err) => {
            console.error(err);
            this.emit('end');
        })
        // Convert Stream to buffer
        .pipe(source(config.filename + '.js'))
        .pipe(buffer())
        // if not dev, uglify the code
        .pipe(gulpif(!config.isDev, uglify()))
        .pipe(gulp.dest(config.scripts.out))
        .pipe(reload({stream:true}));
    });
});

gulp.task('browser-sync', () => {
    //watch files
    const files = [
        './assets/styles/style.css',
        './**/*.php'
    ];

    //initialize browsersync
    browserSync.init(files, {
        server: {
            baseDir: "./"
        }
    });
});

/**
 * Watches for changes and calls the correct task
 */
gulp.task('watch', ['scripts', 'browser-sync'], () => {
    gulp.watch(config.scripts.watch, ['scripts']);
});


/**
 * Our Default task gets executed when calling gulp.
 */
gulp.task('default', ['clean'], () => {
    if (config.isDev) {
        gulp.start('watch');

    }
    else {
        gulp.start('scripts');
    }
});