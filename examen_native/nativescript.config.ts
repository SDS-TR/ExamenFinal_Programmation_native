import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.examen.livres',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
  },
  hooks: [
    {
      type: 'before-buildAndroidPlugin',
      script: './scripts/patch-android-gradle.js',
    },
  ],
} as NativeScriptConfig;
