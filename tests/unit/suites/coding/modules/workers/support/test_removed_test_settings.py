import pytest

from suites.coding.modules.workers.support.work_catalogue import EDITABLE_KEYS
from suites.coding.modules.workers.support.worker_settings import DELIVERY_FAILURE_LIMIT, WORKER_PHASE_TEST_RUNS, WORKER_RUN_FAILURE_LIMIT, WORKER_SETTING_VALUES
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT

REMOVED_KEYS = ("journal.suites.coding.workers.test-at-phase-end", "journal.suites.coding.workers.test-batch-size")
REMAINING_KEYS = (WORKER_PHASE_TEST_RUNS, WORKER_TEST_LIMIT, WORKER_RUN_FAILURE_LIMIT, DELIVERY_FAILURE_LIMIT)


@pytest.mark.parametrize("key", REMOVED_KEYS)
def test_the_settings_of_tests_at_a_phase_end_and_in_batches_are_declared_no_more(key):
    assert all(not key.endswith(f".{value.key}") for value in WORKER_SETTING_VALUES) and key not in EDITABLE_KEYS


@pytest.mark.parametrize("key", REMAINING_KEYS)
def test_each_number_of_the_tests_tab_is_still_editable(key):
    assert key in EDITABLE_KEYS
