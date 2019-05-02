# Installation

The installation of proxrox requires you to have Node.js >= v0.12 and NPM installed. Also, in order to execute proxrox, you will also need to have Nginx installed, on your `$PATH` and executable without super-user privileges.

This document describes and explains the installation of the required components for Mac OS X and Linux operating systems.

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Installation of Node.js and NPM](#installation-of-nodejs-and-npm)
- [Installation of proxrox](#installation-of-proxrox)
- [Installation of Nginx](#installation-of-nginx)
	- [Install Nginx on Mac OS X](#install-nginx-on-mac-os-x)
	- [Install Nginx on Ubuntu](#install-nginx-on-ubuntu)

<!-- /TOC -->

> **Why don't you support super-user privileges for Nginx?**
>
> While it would be possible to execute proxrox and Nginx *with* super-user privileges, this is strongly discouraged for security reasons. We don't want users to open up their machines to software they downloaded via the internet. Especially since it is easy to avoid.

## Installation of Node.js and NPM
Mac OS X and Linux users can install Node.js via the
[Node Version Manager](https://github.com/creationix/nvm) (NVM). NVM makes it easy to switch between installed Node.js versions and to install global modules without super-user privileges. Windows users should follow the instructions on the [official website](http://nodejs.org/).

The first step requires you to install NVM itself. This is a one-liner and explained in [the project's README](https://github.com/creationix/nvm#install-script). For reference and convenience, this is the required installation step at the time of writing.

```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
```

This will give you an `nvm` command that can be used to install, uninstall and switch between Node.js versions. If the `nvm` command should be missing, try to source the file manually via `. "$HOME/.nvm/nvm.sh"`.

Now the `nvm` command can be used to install the latest version of Node.js via:

```
$ nvm install node
$ node -v
v5.2.0
```

## Installation of proxrox
Proxrox requires Node.js >= v0.12.0 and NPM to be installed. If you followed the previous section, this will be the case for you. Proxrox is often installed as a development dependency and listed in a `package.json`, but we can also install it globally.

```
$ npm install -g proxrox
$ proxrox -V
1.11.0
```

## Installation of Nginx
The installation of Nginx varies per operating system. The following sections explain the installation procedure for the respective operating systems.

### Install Nginx on Mac OS X
[Homebrew](http://brew.sh/), a Mac OS X package manager, makes the installation of Nginx with various extensions very easy. You will only need to execute the following on your terminal and your are all set.

```
$ brew tap homebrew/nginx
$ brew update
$ brew install nginx
$ nginx -v
nginx version: nginx/1.8.0
```

Please note that some nginx features aren't installed when making use of the default nginx formula. Refer to the brew formula to learn how to install optional features.

### Install Nginx on Ubuntu
On Ubuntu you could install Nginx with `apt-get`:

```
sudo apt-get install nginx
```

Nginx must be executed with your own user. You can achieve this by adding the path to the Nginx executable to the sudoers file.

```
sudo visudo -f /etc/sudoers.d/nginx
```

In the file add the line

```
<username> localhost = (root) NOPASSWD: /path/to/nginx
```

Replace `<username>`` with the output of `whoami` and `/path/to/nginx` with the output of `which nginx`. Further information is available via [StackOverflow](http://askubuntu.com/questions/159007/how-do-i-run-specific-sudo-commands-without-a-password).

You will also need to `chown` the Nginx error log so it is accessible by your user. You can see the location of this log file when you run `nginx -V` as the `--error-log-path` configure argument's parameter.
