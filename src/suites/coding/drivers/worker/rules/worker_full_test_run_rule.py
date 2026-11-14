from suites.coding.rules.no_full_test_run_rule import NoFullTestRunRule
from suites.coding.support.coding_nudges import WORKER_FULL_TEST_RUN


class WorkerFullTestRunRule(NoFullTestRunRule):
    """A worker runs only the tests of what it changed: a tool call with a run of the whole suite in its chain is
    refused whole."""

    name = "workers.no-full-test-run"
    exempt = False
    refusal = WORKER_FULL_TEST_RUN
