# Tests and the judge at the end of a plan phase

- While working a plan phase, write every task of the phase first and run nothing between tasks: no tests, no checks, no code formatters (Pint) and no linters or static analysis (PHPStan, the commandments judge, type checks), not even for one file.
- At the end of the phase, run all of them once: the phase's tests, Pint, PHPStan and the judge; fix what they find, and rerun only what failed.
- The standard test run is `composer test:affected`: it runs only the tests the changed files can break, read from the domain boundaries. Run the whole suite at the end of a plan, or where a phase checkpoint or the user asks for it.
