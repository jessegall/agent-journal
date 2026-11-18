# Tests and the judge at the end of a plan phase

- While working a plan phase, write every task of the phase first and do not run the tests or the commandments judge between tasks. A single targeted test now and then, for a change you cannot otherwise trust, is fine; a run after each task is not.
- At the end of the phase, run the phase's tests and the judge once, fix what they find, and rerun only what failed.
- Type checks (PHPStan) and formatting (Pint) may still run while writing.
- `composer test:affected` runs only the tests the changed files can break, read from the domain boundaries.
