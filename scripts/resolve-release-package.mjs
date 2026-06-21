import { appendFileSync } from 'node:fs';
import {
  readPackageVersion,
  releasePackages,
  tagForPackage,
} from './release-packages.mjs';

function parseArgs(argv) {
  const options = {
    packageName: undefined,
    tag: process.env.GITHUB_REF_NAME,
    version: undefined,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--package') {
      const value = argv[index + 1];
      if (!value) throw new Error('Missing value for --package');
      options.packageName = value;
      index += 1;
      continue;
    }
    if (arg === '--tag') {
      const value = argv[index + 1];
      if (!value) throw new Error('Missing value for --tag');
      options.tag = value;
      index += 1;
      continue;
    }
    if (arg === '--version') {
      const value = argv[index + 1];
      if (!value) throw new Error('Missing value for --version');
      options.version = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!options.tag && !(options.packageName && options.version)) {
    throw new Error('Missing --tag or --package plus --version');
  }

  return options;
}

const options = parseArgs(process.argv.slice(2));
const publishablePackages = releasePackages.map((packageInfo) => {
  const version = readPackageVersion(packageInfo);
  return {
    ...packageInfo,
    tag: tagForPackage(packageInfo.name, version),
    version,
  };
});

const matched = options.packageName
  ? publishablePackages.find(
      (packageInfo) =>
        packageInfo.name === options.packageName &&
        packageInfo.version === options.version,
    )
  : publishablePackages.find((packageInfo) => packageInfo.tag === options.tag);

if (!matched) {
  const selector = options.packageName
    ? `${options.packageName}@${options.version}`
    : options.tag;
  throw new Error(`${selector} does not match a publishable package release`);
}

const outputs = {
  directory: matched.directory,
  name: matched.name,
  version: matched.version,
};

for (const [key, value] of Object.entries(outputs)) {
  console.log(`${key}=${value}`);
}

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    `${Object.entries(outputs)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')}\n`,
  );
}
