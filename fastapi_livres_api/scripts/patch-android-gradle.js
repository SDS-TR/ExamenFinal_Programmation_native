const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OVERRIDE_LINE = 'android.overridePathCheck=true';

function patchGradleProperties(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(OVERRIDE_LINE)) {
    return true;
  }

  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  lines.push(OVERRIDE_LINE);
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
  return true;
}

function patchNativeScriptGradleTemplate() {
  try {
    const globalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
    const templatePath = path.join(
      globalRoot,
      'nativescript',
      'vendor',
      'gradle-plugin',
      'gradle.properties'
    );
    return patchGradleProperties(templatePath);
  } catch {
    return false;
  }
}

function patchProjectGradleFiles(projectDir) {
  patchGradleProperties(path.join(projectDir, 'App_Resources', 'Android', 'gradle.properties'));
  patchGradleProperties(path.join(projectDir, 'platforms', 'android', 'gradle.properties'));
  patchGradleProperties(path.join(projectDir, 'platforms', 'tempPlugin', 'core', 'gradle.properties'));
}

/** Hook NativeScript : exécuté juste avant gradlew du plugin Android. */
module.exports = function () {
  const projectDir = path.join(__dirname, '..');
  const pluginGradle = path.join(projectDir, 'platforms', 'tempPlugin', 'core', 'gradle.properties');
  patchGradleProperties(pluginGradle);
  patchProjectGradleFiles(projectDir);
  return Promise.resolve();
};

/** Peut aussi être lancé manuellement : node scripts/patch-android-gradle.js */
if (require.main === module) {
  const projectDir = path.join(__dirname, '..');
  patchNativeScriptGradleTemplate();
  patchProjectGradleFiles(projectDir);
  console.log('Correctif Gradle (chemins accentués) appliqué.');
}
