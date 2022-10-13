import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import anyTest, { TestFn } from 'ava';
import { fileExists, runCLI } from '@methodgrab/initializer-utils/testing';
import { Answers } from './cli.js';

const test = anyTest as TestFn<Context>;

type Context = {
	result: Awaited<ReturnType<typeof runCLI>>;
};

const answers: Answers = {
	PACKAGE_OWNER: 'test-owner',
	PACKAGE_NAME: 'test-package',
	AUTHOR: 'test-author',
	SUMMARY: 'Lorem ipsum dolor sit ammet.',
	LICENSE: 'ISC',
};

/** Timeout for runCLI (in ms). */
const runCliTimeout = 250;

/** Timeout for test runner (in ms). */
const testTimeout = (Object.values(answers).length * runCliTimeout) + 10000;

const run = async () => {
	return await runCLI(new URL('../dist/cli.js', import.meta.url), {
		answers: Object.values(answers),
		timeout: runCliTimeout,
	});
};

test.before('Run the CLI', async t => {
	t.timeout(testTimeout, 'Make sure the interactive CLI has run.');
	t.context.result = await run();
});

test.after.always('Clean up temp files', async t => {
	if (t.context.result && typeof t.context.result.cleanup === 'function') {
		await t.context.result.cleanup();
	}
});

test('it creates the expected files', async t => {
	const files = [
		'.github/actions/install/action.yaml',
		'.github/workflows/CI.yaml',
		'src/Example.elm',
		'tests/ExampleTests.elm',
		'.gitignore',
		'elm.json',
		'LICENSE',
		'package.json',
		'README.md',
	];

	for (const file of files) {
		t.true(await fileExists(t.context.result.outputDir, file), `Could not find \`${file}\` in the output dir.`);
	}
});

test('it replaces the template variables in the files with the prompt answers', async t => {
	const elmJson = (await readFileJSON(outputFile(t.context, 'elm.json'))) as Record<string, string>;
	t.is(elmJson.name, `${answers.PACKAGE_OWNER}/${answers.PACKAGE_NAME}`);
	t.is(elmJson.summary, answers.SUMMARY);
	t.is(elmJson.license, answers.LICENSE);

	const license = (await readFileString(outputFile(t.context, 'LICENSE')));
	t.regex(license, new RegExp(`Copyright \\(c\\) \\d+, ${answers.AUTHOR}`));
});

const outputFile = (context: Context, file: string): string =>
	join(context.result.outputDir, file);

const readFileString = async (path: string): Promise<string> =>
	await readFile(path, 'utf-8');

const readFileJSON = async (path: string): Promise<unknown> =>
	JSON.parse(await readFileString(path)) as unknown;
