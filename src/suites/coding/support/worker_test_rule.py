WORKER_TEST_RULE = ("When you commit your work with journal worker commit, the journal judges it and tests it for you: outside a plan on your commit, in a plan "
                    "the tests of each checkpoint in the background on your commit; a failure comes back to you first. Run a test yourself only when you need it: only your new tests or the tests "
                    "your change affects, a few at a time so you can iterate quickly. Never run the full test suite: a worker that does is refused and reported.")
