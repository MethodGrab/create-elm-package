export default {
	extensions: {
		ts: 'module',
	},
	nodeArguments: [
		'--loader=ts-node/esm',
	],
	files: [
		'src/**/*.test.ts',
	],
	// Disabling worker threads is required to use process.chdir() otherwise you get:
	// TypeError { code: 'ERR_WORKER_UNSUPPORTED_OPERATION', message: 'process.chdir() is not supported in workers' }
	// https://github.com/avajs/ava/issues/2956#issuecomment-1023770164
	workerThreads: false,
};
