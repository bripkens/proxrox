# proxrox &nbsp; [![Build Status](https://travis-ci.org/bripkens/proxrox.svg?branch=master)](https://travis-ci.org/bripkens/proxrox)
[![Dependency Status](https://david-dm.org/bripkens/proxrox/master.svg)](https://david-dm.org/bripkens/proxrox/master)
[![devDependency Status](https://david-dm.org/bripkens/proxrox/master/dev-status.svg)](https://david-dm.org/bripkens/proxrox/master#info=devDependencies)
[![npm version](https://badge.fury.io/js/proxrox.svg)](https://badge.fury.io/js/proxrox)

#### Avoid SOP problems, combine origins, proxy services, use SSL, SPDY, SSI… during development!

---

**[Installation](INSTALLATION.md) |**
**[Usage](README.md#usage) |**
**[Configuration](CONFIGURATION.md) |**
**[Example projects](examples) |**
**[Changelog](CHANGELOG.md)**

---


Proxrox is a command line utility which starts a local Nginx instance to serve up static files, proxy one or many services under a single origin, use SSL locally and, generally, to get a development environment that is
similar to a production environment.

Proxrox achieves this using Nginx. When proxrox is asked to start a server, it will create an Nginx config file in a temporary location and start an Nginx instance using this config file. This means that proxrox can theoretically support all of Nginx's features.

## Installation
**TL;DR;** `npm install -g proxrox`. Nginx needs to be on the `$PATH` and executable without super-user privileges.

Detailed installation instructions can be found in [INSTALLATION.md](INSTALLATION.md).


## Usage
Serve the current working directory via `http`:
```
proxrox start
```

Serve the current working directory via `http` and fall back to a proxy
for all requests that couldn't be served from the working directory:
```
proxrox start --proxy http://127.0.0.1:8080
```

Enable server-side includes, transport layer security and SPDY support:
```
proxrox start --spdy --ssi
```

Start proxrox using a local configuration file. Format and supported options are explained in the [CONFIGURATION.md](CONFIGURATION.md) file.
```
proxrox start .proxrox.yaml
```

Stop the running Nginx instances (stops all):
```
proxrox stop
```

Install Nginx. This command is platform specific and currently only works on OS X.
```
proxrox install
```

Experience has shown that the definition of options via configuration files, e.g. `proxrox.yaml`, is the most commonly used option. Working example projects with the recommended project setup can be seen in the [examples](examples) directory.

## Why proxrox exists

### Production and development environment parity
Development environments should resemble production environments.
This means that server-side includes, transport layer security, compression
and more should exist during development. Not only is this important for
page speed optimizations, but it also allows you to find security
issues early, e.g. a secure page which references insecure content.

### Serving multiple services under a single [origin](https://tools.ietf.org/html/rfc6454)
Whether the app is service-oriented, micro service based,
[resource-oriented client architecture](http://roca-style.org/) like
or a single page app, the
[same-origin policy](https://www.w3.org/Security/wiki/Same_Origin_Policy)
is often an issue for local development. People circumvent this issue in
various ways. While most teams have good practices in place for production
environments, development environments often lack this. Solutions I have
seen range from [cross-origin resource sharing](http://www.w3.org/TR/cors/)
for local development activated via feature flags to completely disabling web
security in browsers.

### Extending the space of possible solutions
Many people don't know or use server-side includes. There are probably various
reasons for this. One thing that I noticed myself is that it just takes time
to setup a proper development environment with proxy servers.

## Usage Statistics

[![NPM](https://nodei.co/npm/proxrox.png?downloads=true&downloadRank=true)](https://nodei.co/npm/proxrox/)
[![NPM](https://nodei.co/npm-dl/proxrox.png)](https://nodei.co/npm/proxrox/)

## License (MIT)

    The MIT License (MIT)

    Copyright (c) 2015 Ben Ripkens

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
