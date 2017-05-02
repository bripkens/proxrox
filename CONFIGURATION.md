# Configuration

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Config Format](#config-format)
- [Configuration Options](#configuration-options)
	- [serverName](#servername)
	- [port](#port)
	- [root](#root)
	- [logDir](#logdir)
	- [directoryIndex](#directoryindex)
	- [gzip](#gzip)
	- [proxy](#proxy)
	- [websocketProxy](#websocketproxy)
	- [tls](#tls)
  - [tlsCertificateFile](#tlsCertificateFile)
  - [tlsCertificateKeyFile](#tlsCertificateKeyFile)
	- [spdy](#spdy)
	- [http2](#http2)
	- [ssi](#ssi)
	- [stubStatus](#stubstatus)

<!-- /TOC -->

## Config Format

Proxrox can be started with a config from the file system. This file
can be shared in a team, e.g. placed in a repository, to ensure that
every team member is using the same configuration. Proxrox supports two
config file formats:

 - JSON (recommended file name is `.proxrox.json`)
 - YAML (recommended file name is `.proxrox.yaml`)

All configuration options in this config file will take precedence over
proxrox's defaults and the CLI arguments. If you need to adapt
options to developers' machines, then you shouldn't put these options into
the config file as these values would otherwise take precedence.

A configuration file in the YAML format (in `.proxrox.yaml`) would look like
this. The following sections explain the supported options.

```
# you can use YAML comments
proxy: 'http://127.0.0.1:8080'
spdy: true
ssi: true
root: './web'
```

## Configuration Options

### serverName
This option is used to populate nginx's `server_name` directive. Most users
will not make use of this option and can use the default value.

 - **Type**: `string`
 - **Default**: `'example'`
 - **Nginx docs**:
   - http://nginx.org/en/docs/http/server_names.html
   - http://nginx.org/en/docs/http/ngx_http_core_module.html#server_name

### port
The port to bind to.

 - **Type**: `number`
 - **Default**: `4000`
 - **Nginx docs**:
   - http://nginx.org/en/docs/http/ngx_http_core_module.html#listen

### root
Defines the path to the directory which should be served via HTTP. You can
use absolute paths or relative paths that are resolved against the location
of the config file.

Use `false` to deactivate serving of static assets. This is only useful if you
are using proxrox to combine multiple services via proxies and don't care
about serving static assets from the file system.

 - **Type**: `string` or `boolean` (only `false` is supported)
 - **Default**: The current working directory
 - **Nginx docs**:
   - http://nginx.org/en/docs/http/ngx_http_core_module.html#root

### logDir
Defines the path to the nginx logs.

 - **Type**: `string`
 - **Default**: `'logs/'` (relative to nginx config dir)

### directoryIndex
Whether or not to generated a directory listing for requests to directories.

 - **Type**: `boolean`
 - **Default**: `true`
 - **Nginx docs**:
   - http://nginx.org/en/docs/http/ngx_http_autoindex_module.html#autoindex

### gzip
Whether or not to use gzip compression for responses (if possible).

 - **Type**: `boolean`
 - **Default**: `true`
 - **Nginx docs**:
   - http://nginx.org/en/docs/http/ngx_http_gzip_module.html#gzip

### proxy
Proxy requests to services via nginx. This is very useful to combine services
under a single origin. Proxies can be used in two ways with proxrox.

 1. When serving static assets, a proxy defined for url `/` will act as a fall
    back for all incoming requests. This is done via a named location which is
    referenced in nginx's `try_files` directive.
 2. When not serving static assets, all proxies are turned into nginx
    location blocks, i.e. for a specific location an nginx proxy is used.

Examples:

The following config is used to serve static assets and to provide a fallback
for incoming requests.

```
root: '/var/www'
proxy: 'http://api.example.com'
```

The previous configuration is effectively the same as writing the following:
```
root: '/var/www'
proxy:
  '/': 'http://api.example.com'
```

Multiple proxies can be used which will be turned into additional nginx
location blocks:
```
root: '/var/www'
proxy:
  '/': 'http://api.example.com'
  '/cms': 'http://127.0.0.1:8080'
```

For more example and resulting nginx configurations take a look at the
[tests](https://github.com/bripkens/proxrox/blob/master/test/config_generator_test.js).

 - **Type**: `string` or `object<string, string>`
 - **Default**: `{}`
 - **Nginx docs**:
   - http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass


### websocketProxy
Similar to the `proxy` directive, the `websocketProxy` directive will proxy requests to services that accept HTTP upgrade requests. In contrast to the `proxy` directive, the `websocketProxy` directive sets the necessary HTTP `Upgrade` and `Connection` headers.

Example:

```
websocketProxy:
  '/socket.io': 'http://127.0.0.1:3000/socket.io'
```


### tls
When set, proxrox will generate a self-signed SSL certificate. Once started,
nginx will only accept `https` connections under the configured `port`.

 - **Type**: `boolean`
 - **Default**: `false`
 - **Nginx docs**:
   - http://nginx.org/en/docs/http/configuring_https_servers.html


### tlsCertificateFile
The location to store the tls Certificate.
When set, proxrox will never generate the SSL certificate,
otherwise regenerate the SSL certificate every time.
If this flag is set, `tlsCertificateKeyFile` must also be set.

 - **Type**: `string`


### tlsCertificateKeyFile
The location to store the tls Certificate key.
When set, proxrox will never generate the SSL certificate,
otherwise regenerate the SSL certificate every time.
If this flag is set, `tlsCertificateFile` must also be set.

 - **Type**: `string`


### spdy
Proxrox can enable SPDY protocol support. Activating SPDY also implies the `tls` option.

 - **Type**: `boolean`
 - **Default**: `false`
 - **Nginx docs**:
   - http://nginx.org/en/docs/http/ngx_http_spdy_module.html

### http2
Proxrox can enable HTTP 2 protocol support. Activating HTTP 2 does not mean that `tls` is implied. Nginx can support HTTP 2 without TLS. This is only available when used with at least nginx 1.9.5.

 - **Type**: `boolean`
 - **Default**: `false`
 - **Nginx docs**:
   - http://nginx.org/en/docs/http/ngx_http_v2_module.html

### ssi
Server-side includes are very useful and can be activated with the `ssi` flag.

 - **Type**: `boolean`
 - **Default**: `false`
 - **Nginx docs**:
   - http://nginx.org/en/docs/http/ngx_http_ssi_module.html

### stubStatus
Make basic Nginx status information available under the URI `/nginx_status`

 - **Type**: `boolean`
 - **Default**: `false`
 - **Nginx docs**:
   - http://nginx.org/en/docs/http/ngx_http_stub_status_module.html
