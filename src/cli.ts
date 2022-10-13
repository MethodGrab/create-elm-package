#!/usr/bin/env node

import { URL } from 'node:url';
import chalk from 'chalk';
import logSymbols from 'log-symbols';
import { type Answers as CreateAnswers, askFor, definePrompts, copyFile, copyFiles, maxLength, required, validateAll } from '@methodgrab/initializer-utils';
import { osiLicenseValidator } from './osi-license.js';
import { getLicenseTemplateFilename, isSupportedLicense } from './license.js';

type TemplateVars = {
	PACKAGE_OWNER: string;
	PACKAGE_NAME: string;
	AUTHOR: string;
	SUMMARY: string;
	LICENSE: string;
	CURRENT_YEAR: string;
};

const prompts = definePrompts({
	PACKAGE_OWNER: {
		type: 'string',
		message: 'What is the GitHub account name where the package will be published?',
		validate: required(),
	},
	PACKAGE_NAME: {
		type: 'string',
		message: 'What is the name of this new package?',
		validate: required(),
	},
	AUTHOR: {
		type: 'string',
		message: 'What is the package authors name (used in the license)?',
		default: partialAnswers => partialAnswers.PACKAGE_OWNER ? `@${partialAnswers.PACKAGE_OWNER}` : undefined,
		validate: required(),
	},
	SUMMARY: {
		type: 'string',
		message: 'A short summary that will appear on package.elm-lang.org that describes what the package is for (max. 80 chars).',
		validate: validateAll([
			required(),
			maxLength(80, 'The summary must be under 80 characters.'),
		]),
	},
	LICENSE: {
		// TODO: maybe this should be list/rawlist? It's a lot of choices though (~100).
		type: 'string',
		message: 'An OSI approved license for your package.',
		default: 'ISC',
		validate: validateAll([
			required(),
			osiLicenseValidator(),
		]),
	},
});

export type Answers = CreateAnswers<typeof prompts>;

try {
	const answers = await askFor(prompts);

	const data: TemplateVars = Object.assign({}, answers, {
		CURRENT_YEAR: new Date().getFullYear().toString(),
	});

	await copyFiles({
		// NOTE: At run-time its relative to `dist` so make sure the `from` path reflects that.
		from: new URL('../templates/base', import.meta.url),
		data,
	});

	await copyFile({
		// NOTE: At run-time its relative to `dist` so make sure the `from` path reflects that.
		from: new URL(`../templates/license/${getLicenseTemplateFilename(data.LICENSE)}`, import.meta.url),
		to: 'LICENSE',
		data,
	});

	if (!isSupportedLicense(data.LICENSE)) {
		// eslint-disable-next-line no-console
		console.warn(chalk.yellow([
			'',
			'======================================================================================',
			`${logSymbols.warning} There is currently no template for the license you selected.`,
			'Please manually update the `./LICENSE` file with the correct details of that license.',
			'======================================================================================',
		].join('\n')));
	}
} catch (error) {
	const message = error instanceof Error ? error.message : 'Unknown error';
	// eslint-disable-next-line no-console
	console.error(chalk.red(message));
	process.exitCode = 1;
}
