import { appendFileSync } from 'node:fs';
import {
  readPackageVersion,
  releasePackages,
  tagForPackage,
} from './release-packages.mjs';

function parseArgs(argv) {
  const options = {
    tag: process.env.GITHUB_REF_NAME,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--tag') {
      const value = argv[index + 1];
      if (!value) throw new Error('Missing value for --tag');
      options.tag = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!options.tag) throw new Error('Missing release tag');
  return options;
}

const options = parseArgs(process.argv.slice(2));
const matched = releasePackages
  .map((packageInfo) => {
    const version = readPackageVersion(packageInfo);
    return {
      ...packageInfo,
      tag: tagForPackage(packageInfo.name, version),
      version,
    };
  })
  .find((packageInfo) => packageInfo.tag === options.tag);

if (!matched) {
  throw new Error(
    `Release tag ${options.tag} does not match a publishable package release`,
  );
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
