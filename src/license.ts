import { type OSILicense } from './osi-license.js';

/** Licenses that have included templates. */
const SUPPORTED_LICENSES: OSILicense[] = ['ISC'];

export const isSupportedLicense = (license: string): boolean => {
	const SUPPORTED_LICENSES_: readonly string[] = SUPPORTED_LICENSES;
	return SUPPORTED_LICENSES_.includes(license);
};

export const getLicenseTemplateFilename = (license: string): string =>
	isSupportedLicense(license) ? `LICENSE-${license}` : 'LICENSE-OTHER';
