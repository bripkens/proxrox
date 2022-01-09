# proxrox &nbsp;

Avoid SOP problems, combine origins, proxy services, use SSL, HTTP2, SSI and more… during development!

**[Installation](INSTALLATION.md) |**
**[Usage](#usage) |**
**[Configuration](CONFIGURATION.md) |**
**[Example projects](examples) |**
**[Support](#support) |**
**[Changelog](CHANGELOG.md)**

---


Proxrox is a command line utility which starts a local Nginx instance to serve up static files, proxy one or many services under a single origin, use SSL locally and, generally, to get a development environment that is
similar to a production environment.

Proxrox achieves this using Nginx. When proxrox is asked to start a server, it will create an Nginx config file in a temporary location and start an Nginx instance using this config file. This means that proxrox can theoretically support all of Nginx's features.

You can also use Proxrox to debug web apps, as shown in the following presentation.

<div align="center">
<a href="https://speakerdeck.com/bripkens/man-in-the-middle-yourself-debugging-production-web-apps">
<img src="./presentation.png" alt="Learn about remote debugging with proxrox" width="400">
</a>
</div>

## Installation
**TL;DR;** `npm install -g proxrox`. Nginx needs to be on the `$PATH` and executable without super-user privileges.

Detailed installation instructions can be found in [INSTALLATION.md](INSTALLATION.md).


## Usage
Start proxrox using a local configuration file. Format and supported options are explained in the [CONFIGURATION.md](CONFIGURATION.md) file.
```
proxrox start .proxrox.yaml
```

Stop the running Nginx instances (stops all):
```
proxrox stop
```

Experience has shown that the definition of options via configuration files, e.g. `.proxrox.yaml`, is the most commonly used option. Working example projects with the recommended project setup can be seen in the [examples](examples) directory.

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

## Support
Something not working as expected? Feel free to contact me on Twitter via [@BenRipkens](https://twitter.com/BenRipkens)!

