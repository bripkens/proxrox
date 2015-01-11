# proxrox.js

proxrox.js is a command line utility which starts a local nginx instance to
serve up static files, proxy one or many services under a single origin, use
SSL locally and, generally, to get an environment during development that is
similar to a production environment.

proxrox.js exists for two reasons:

## Production and development environment parity
Development environments should be very similar to production environments.
This means that server-side includes, transport layer security, compression
and more should exist during development. Not only is this important for
page speed optimizations, but it also allows you to find security
issues early, e.g. a secure page which references insecure content.

## Serving multiple services under a single [origin](https://tools.ietf.org/html/rfc6454)
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

## Extending the space of possible solutions
Many people don't know or use server-side includes. There are probably various
reasons for this. One thing that I noticed myself is that it just takes time
to setup a proper development environment with proxy servers.

```
npm install -g proxrox
```

## Roadmap

 - SSL with self-signed certificates for development
 - SPDY
 - custom domains for local development
