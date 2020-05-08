// Use Pretty World
const { inf, command, concert, preset, defer, merge, alias, kit } = require("./ext");

// Use Root
const { path, fs, root } = inf;

// Use Argvs
const { argvs } = command;

// Use Presence
const { resolve, presence } = concert;

// Use Preset
const { rc, injection } = preset;

// Use Kit
const { foreach, check, deep, toStringify, wrapper } = kit;

// Use Utils
const {
  log,
  info,
  done,
  warn,
  error,
  clearConsole,
  exit,
} = require("@vue/cli-shared-utils");

// Argvs overwrite NODE_ENV must before at Vue
if (argvs.mode) {
  process.env.NODE_ENV = argvs.mode;
}

// Prevent Accident
merge(rc.extract);

// into Vue Cli Lifecycle
module.exports = (api, options, rootOptions) => {
  // Merge User Config 2 Project Options
  Object.assign(api.service.projectOptions, rc);

  // Chain Webpack
  api.chainWebpack((webpackConfig) => {
    // Set Defer in Vue
    defer(argvs);

    // Set Context Alias
    alias(webpackConfig.resolve.alias, rc.extract);

    // Argvs + Injection
    let parameter = toStringify({
      ...argvs,
      ...injection,
			rc
    });

    // Injection
    webpackConfig.plugin("define").tap(
      // Definitions
      (definitions) => {
        // Extension
        Object.assign(definitions[0]["process.env"], parameter);
        // Return
        return definitions;
      }
    );
  });
};
