WORKER_TEST_RULE = ("When you commit your work with journal worker commit, the journal judges it and tests it for you: outside a plan on your commit, in a plan "
                    "the tests of each checkpoint in the background on your commit; a failure comes back to you first. In a plan, run no test inside a phase: "
                    "at the phase's end run its tests once, and after a failure run again only the failed tests by name. Outside a plan, run a test yourself only "
                    "when you need it: only your new tests or the tests your change affects, a few at a time. Never run the full test suite: a worker that does "
                    "is refused and reported.")
