# Tests and the judge at the end of a plan phase

- While working a plan phase, write every task of the phase first and run nothing between tasks: no tests, no PHPStan, no commandments judge, no other check.
- At the end of the phase, run the phase's tests, PHPStan, formatting and the judge once, fix what they find, and rerun only what failed.
- `composer test:affected` runs only the tests the changed files can break, read from the domain boundaries.
