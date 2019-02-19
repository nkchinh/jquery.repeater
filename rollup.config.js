import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

const createMinFileName = (fileName) => {
	const dotInx = fileName.lastIndexOf('.');
	let slashInx = fileName.lastIndexOf('/');
	const bslashInx = fileName.lastIndexOf('\\');

	slashInx = Math.max(slashInx, bslashInx);

	if (dotInx > slashInx) {
		return `${fileName.substring(0, dotInx)
		}.min${fileName.substring(dotInx)}`;
	}

	return `${fileName}.min`;
};

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			file: pkg.main,
			format: 'umd',
			globals: {
				jquery: 'jQuery',
			},
			sourcemap: true,
		},
		plugins: [
			resolve(),
			commonjs(),
			babel({
				exclude: 'node_modules/**',
			}),
		],
		external: [
			'jquery',
		],
	},

	// minify browser js
	{
		input: pkg.main,
		output: {
			file: createMinFileName(pkg.main),
			format: 'cjs',
		},
		context: 'this',
		plugins: [
			uglify({
				sourcemap: true,
			}),
		],
	},
];
