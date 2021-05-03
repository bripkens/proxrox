# Changelog

## Unreleased

 - Add `proxyReadTimeout` to configuration.

## 1.16.0
 - Updated `mkdirp` dependency to recent version.
 - When creating temporary directories for nginx config, explicitly set the `umask` (file permissions).
 - Upgrade shelljs to at least `0.8.4` to remove warnings in Node.js 14.

## 1.15.0
 - Dependencies upgraded to address (non-critical) security vulnerabilities in dependencies.
 - `proxrox install` will now install the regular `nginx` formula on MacOS.
 - Use `SHA256` for TLS certificates.
 - Allow additional site definitions when starting the proxy.

## 1.14.4
 - Upgrade `js-yaml` and `mocha` to resolve security vulnerabilities.

## 1.14.3
 - Do not accept gzip from upstreams when server-side includes are enabled, both the combination does not work.
 - Reduce the number of files included in releases to those necessary.

## 1.14.2
 - Update dependencies due to security vulnerabilities.
 - Add `package-lock.json`.

## 1.14.1
 - Upgrade lodash and fs-extra.
 - Add `-subj` to ssl certificate generation as without any *dn*, the creation leads to errors.

## 1.14.0
 - Add `--stub-status` option to CLI. Contributed by @jbrisbin via [PR#28](https://github.com/bripkens/proxrox/pull/28).

## 1.13.0
 - Allow usage of existing SSL certificate.

## 1.12.2
 - Disable proxy caching to avoid caching problems during development.
 - Update dependencies.

## 1.12.1
 - Upgrade dependencies to avoid insecure `node-uuid` versions and reduce footprint of proxrox.

## 1.12.0
 - Enable usage of Proxrox with Heroku and many other hosters which dispatch based on the `Host` header.

## 1.11.0
 - All dependencies have been updated to their latest version.

## 1.10.2
 - Proxy fallback is incompatible with `$uri/` fallback. Contributed by @orangecoding via [PR#20](https://github.com/bripkens/proxrox/pull/20).

## 1.10.1
 - Automatic nginx installation takes time. Users should be informed about the progress of the installation by forwarding brew's output.

## 1.10.0
 - Install full nginx with stub status support when executing `proxrox install` for OS X.

## 1.9.0
 - Enable nginx stub status page via `stubStatus`.

## 1.8.1
 - Do not swallow nginx startup messages, e.g. startup failures.

## 1.8.0
 - It is a common use case to specify proxrox as a dev dependency. Removing the `preferGlobal` flag will avoid unnecessary warnings in projects.
 - HTTP 2 protocol support. Available when used with at least nginx 1.9.5.

## 1.7.2
 - Specify temp file paths to avoid privilege issues. Fixes [issue #17](https://github.com/bripkens/proxrox/issues/17).

## 1.7.1
 - `child_process.spawnSync` is now used to start and stop nginx in order to cope
   avoid hanging stop operations which occurred on some operations systems. Contributed by @basti1302 via [PR#14](https://github.com/bripkens/proxrox/issues/14).

## 1.7.0
 - WebSocket connects can now be proxied.

## 1.6.0
 - Remove request body size restrictions to enable file uplodas to proxied
   backends.

## 1.5.0
 - `proxrox stop` no longer exists with a status code != 0 when no nginx
   process was running.

## 1.4.0
 - proxy multiple services via the `proxy` configuration option
 - disable static asset serving via `root: false`

## 1.3.0
 - fixes an issue where proxrox tried to read the pid file before nginx
   finished starting up
 - share proxrox configurations and start proxrox with a local configuration
   file in JSON and YAML format via `proxrox start [config]`

## 1.2.0
 - automatically create a self-signed certificate and enable transport layer
   security via `--tls`
 - support SPDY via `--spdy`

## 1.1.0
 - enable GZIP compression by default
 - disable GZIP compression with `--no-compression`
 - enable SSI via `--ssi`

## 1.0.2
 - typo in `colors` dependency

## 1.0.1
 - add missing `colors` dependency

## 1.0.0
 - install nginx automatically via the CLI
 - Start and stop nginx via the CLI
 - Support proxying a single service
