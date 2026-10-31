import statistics
import time

from tests.stories.core.support.fixtures import ThreeTasks
from tests.stories.server.server_hooks import example
from tests.stories.server.support.server_client import server_story

HOOKS = 60
MEDIAN_BUDGET_MS = 50.0
WORST_BUDGET_MS = 500.0
EXAMPLES = ("prompt", "edit", "stop")


def test_a_hook_to_the_server_answers_within_the_budget_that_the_measuring_scripts_set(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        times = []
        for position in range(HOOKS):
            started = time.perf_counter()
            story.expect_hook_answer("/hook", example(EXAMPLES[position % len(EXAMPLES)]), 200, '"refusal": ""')
            times.append((time.perf_counter() - started) * 1000)
        assert statistics.median(times) < MEDIAN_BUDGET_MS and max(times) < WORST_BUDGET_MS, (statistics.median(times), max(times))
