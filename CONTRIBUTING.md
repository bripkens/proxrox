# How to contribute

Proxrox contributions are welcome! Feel free to send a pull request
if you find that something is missing or broken. Make sure to discuss new features via GitHub issues before you start working on them.

## Making Changes

* Create a topic branch from where you want to base your work.
  * This is usually the master branch.
  * Only target release branches if you are certain your fix must be on that
    branch.
  * To quickly create a topic branch based on master; `git checkout -b
    my_topic_branch_name master`. Please avoid working directly on the
    `master` branch.
* Make commits of logical units.
* Check for unnecessary whitespace with `git diff --check` before committing.
* Ensure that your code tests and lints successfully via `npm test`.
* Make sure your commit messages are in the proper format.

```
Short (50 chars or less) summary of changes

More detailed explanatory text, if necessary.  Wrap it to
about 72 characters or so.  In some contexts, the first
line is treated as the subject of an email and the rest of
the text as the body.  The blank line separating the
summary from the body is critical (unless you omit the body
entirely); tools like rebase can get confused if you run
the two together.

Further paragraphs come after blank lines.

  - Bullet points are okay, too

  - Typically a hyphen or asterisk is used for the bullet,
    preceded by a single space, with blank lines in
    between, but conventions vary here
```
Source: http://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project

## Code of Conduct
This project adheres to the [Open Code of Conduct](http://todogroup.org/opencodeofconduct/#proxrox/bripkens.dev@gmail.com). By participating, you are expected to honor this code.
