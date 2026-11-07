import os
import pytest
import statistics
import time

from tests.stories.core.support.fixtures import ThreeTasks
from tests.stories.server.server_hooks import example
from tests.stories.server.support.server_client import server_story

HOOKS = 60
MEDIAN_BUDGET_MS = 50.0
WORST_BUDGET_MS = 500.0
EXAMPLES = ("prompt", "edit", "stop")


@pytest.mark.skipif("PYTEST_XDIST_WORKER" in os.environ, reason="a time limit means nothing beside five other workers: run this file alone")
def test_a_hook_to_the_server_answers_within_the_budget_that_the_measuring_scripts_set(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        durations_ms = []
        for position in range(HOOKS):
            started = time.perf_counter()
            story.expect_hook_answer("/hook", example(EXAMPLES[position % len(EXAMPLES)]), 200, '"refusal": ""')
            durations_ms.append((time.perf_counter() - started) * 1000)
        expect_median_statistics_less(durations_ms, MEDIAN_BUDGET_MS)
        expect_max_less(durations_ms, WORST_BUDGET_MS)


def expect_median_statistics_less(durations_ms, expected) -> None:
    actual = statistics.median(durations_ms)
    assert actual < expected, actual


def expect_max_less(durations_ms, expected) -> None:
    actual = max(durations_ms)
    assert actual < expected, actual
