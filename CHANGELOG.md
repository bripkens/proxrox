# Changelog

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
