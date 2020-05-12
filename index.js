// Use Pretty World
const {
  inf,
  command,
  concert,
  preset,
  defer,
  merge,
  alias,
  matching,
  kit,
} = require("./ext");

// Use Share Utils
const {
  log,
  info,
  done,
  warn,
  error,
  clearConsole,
  exit,
} = require("@vue/cli-shared-utils");

// Use Root
const { path, fs, root } = inf;

// Use Argvs
const { argvs } = command;

// Use Presence
const { resolve } = concert;

// Use Preset
const { rc, injection } = preset;

// Use Kit
const { assign, toStringify } = kit;

// Argvs overwrite NODE_ENV must before at Vue
process.env.NODE_ENV = "production";

// Coverage
if (argvs.mode) {
  process.env.NODE_ENV = argvs.mode;
}

// Matching
matching(injection, {
  NODE_ENV: process.env.NODE_ENV,
});

// Assigning Injection to `process` before aVue Life
assign(process, injection, "injection");

// Prevent Accident
merge(rc.extract);

// into Vue Cli Lifecycle
module.exports = (api, options, rootOptions) => {
  // Merge User Config 2 Project Options
  assign(api.service.projectOptions, rc);

  // Chain Webpack
  api.chainWebpack((webpackConfig) => {
    // Set Defer in Vue
    defer(argvs);

    // Set Context Alias
    alias(webpackConfig.resolve.alias, rc.extract);

    // Argvs + Injection + Rc
    let parameter = toStringify({
      ...argvs,
      ...injection,
      rc,
    });

    // Injection
    webpackConfig.plugin("define").tap(
      // Definitions
      (definitions) => {
        // Extension in Vue Life
        assign(definitions[0]["process.env"], parameter);
        // Return
        return definitions;
      }
    );
  });
};
