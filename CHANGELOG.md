## Changelog

+ 3.3.0 - updated deps, cleaned up cli interface and added tests

+ 3.2.3 - fixed bug with checking if input isFile and output isDirectory and added tests to cover this

+ 3.2.2 - fixed bug with escaping apostrophe and removed testOut folder

+ 3.2.0 - added basic cli interface, test and instructions on use

+ 3.1.0 - improved checking of input and output options, default parser of rows improved by using flat module

+ 3.0.0 - major bump for node 4+ support only, updated dependencies and moved to ES6 syntax

+ 2.0.0 - merge toJsonObj and writeFiles methods into toJson which will accept one parameter of toWrite which will be true by default which will write file as configured in options passed to constructor. Updated deps, extended travis config and improved tests plus removed std-mocks as not required.

+ 1.3.0 - added toJsonObj method for converting excel into json stringified object which can be used by higher level apis

+ 1.2.0 - changed writeFile to writeFiles to be more descriptive, amended readme to explain usage better, enable plugin of formatter functions (defaults to no formatting if not specified)

+ 1.1.3 - fixed broken test due to missing output directory

+ 1.1.2 - modified .gitignore and added code coverage badge

+ 1.1.1 - added repo filed and ammended licence type both in package.json file

+ 1.1.0 - changed cursor method to streamSheet and added streamBook method to fix issue #2, added .estlinrc and improved type checking of streamSheet function

+ 1.0.1 - removed line form README

+ 1.0.0 - fixed broken, dev dependencies badge, improved tests and removed unused test excel files

+ 0.0.5 - fixed broken travis link

+ 0.0.4 - fixed travis badge

+ 0.0.3 - fixed failing tests

+ 0.0.2 - added travis, fixed typo in README and added badges
