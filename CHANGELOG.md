# Changelog

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
