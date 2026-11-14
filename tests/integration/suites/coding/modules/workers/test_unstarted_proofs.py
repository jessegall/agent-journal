from datetime import timedelta

import pytest

from engine.log.exception_sink import ExceptionSink
from suites.coding.modules.workers.commands.queue_worker_tests.start_worker_tests_handler import StartWorkerTestsHandler
from suites.coding.modules.workers.listeners.support.worker_test_starts import WorkerTestStarts
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.ticks.worker_tests.stalled_worker_test_runs import STALLED_TESTS_TICK
from tests.stories.suites.coding.modules.workers.stalled_tests import two_tasks  # noqa: F401
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT

UNSTARTED_TICK = "unstarted worker proofs"
FAULT = "RuntimeError: the checkout is gone"


class CheckoutGone(RuntimeError):
    def __init__(self) -> None:
        super().__init__("the checkout is gone")


def stuck_queue(story, worker, monkeypatch) -> None:
    """A proof is queued, nothing runs in its worktree, and the tick that starts it fails each minute."""
    with monkeypatch.context() as stopped_server:
        stopped_server.setattr(WorkerTestStarts, "start_next", lambda starts, logged: None)
        story.expect_text(COMMIT, "its tests are queued", actor=worker)
    monkeypatch.setattr(StartWorkerTestsHandler, "handle", lambda handler, command, context: (_ for _ in ()).throw(CheckoutGone()))
    with pytest.raises(CheckoutGone):
        story.run_tick_handler(STALLED_TESTS_TICK)
    story.container.get(ExceptionSink).record(STALLED_TESTS_TICK, FAULT, None)


def test_a_queued_proof_with_a_free_slot_that_the_tick_cannot_start_reaches_the_main_agent_within_three_minutes_once(two_tasks, monkeypatch):  # noqa: F811
    story, worker, _ = two_tasks
    stuck_queue(story, worker, monkeypatch)
    story.advance(timedelta(minutes=2))
    story.run_tick_handler(UNSTARTED_TICK)
    story.expect_absent(f"agent-line list --agent {story.agent.id}", "not started", actor=story.agent)
    story.advance(timedelta(minutes=2))
    story.run_tick_handler(UNSTARTED_TICK)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "Proofs 1 are queued 3 min and not started", FAULT, actor=story.agent)
    story.run_tick_handler(UNSTARTED_TICK)
    story.expect_rows(len([line for line in story.story_rows(MergerLine) if "not started" in line.text]) == 1)
