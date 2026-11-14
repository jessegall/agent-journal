from tests.stories.core.support.agent_labels import agent_number
from engine.actor.actor import Actor
from engine.command.bus import Bus
from suites.coding.modules.workers.commands.record_own_test_failure.record_own_test_failure import RecordOwnTestFailure
from suites.coding.modules.workers.support.worker_test_failures import ALL_RUN_TESTS, WorkerTestFailures
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, FIRST_PROOF, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

OMISSION = "Left out the phone width, no test exists for it"
WORKER_RUN_LINE = "python3 -m pytest tests/stories/cart.py -q"


def proved_worker(story):
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, "point: 1", actor=worker)
    return repository, worker








def test_a_test_failing_five_times_in_a_workers_own_runs_is_kept_from_the_worker_and_shown_to_the_main_agent(played):
    story = played(OpenTaskOrchestrator)
    _, worker = proved_worker(story)
    bus = story.container.get(Bus)
    for _ in range(5):
        bus.run(RecordOwnTestFailure(worker.id, 1, WORKER_RUN_LINE), Actor.core(), environment_id=1)
    story.expect_rows("failed 5 times" not in story.run("task overview 1", actor=worker).output_text)
    story.expect_success("worker commit --wait --differences none", actor=worker)
    story.expect_text(f"worker logs {agent_number(story, worker.id)}", "! its own runs failed 5 times: tests/stories/cart.py", actor=story.agent)


