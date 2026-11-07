import pytest

from core.base.command.bus import Bus
from core.base.query.queries import Queries
from core.modules.processes.commands.grant_run_slots.grant_run_slots import GrantRunSlots
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.expect_reply import expect_reply_allowed
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.suites.coding.modules.workers.phase_test_requests import WHY, allowed, expect_requests, on_plan, requested  # noqa: F401  (fixtures)
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, RunRequest


def stop_run_at_count(allowed, count_text: str, status: int) -> None:
    install_runner(allowed.story)
    expect_reply_allowed(allowed.run_test())
    expect_requests(allowed, RunRequest(1, TEST_LINE, WHY, "used"))
    process = allowed.story.container.get(Queries).query(Process).filter(session_agent_id=allowed.worker.id).newest().first()
    allowed.story.container.get(OutputFolder).write_count(process.id, count_text, status)
    allowed.story.container.get(Bus).run(GrantRunSlots(), allowed.story.agent, environment_id=1)
    allowed.story.expect_rows(allowed.story.container.get(Queries).query(Process).find(process.id).state is ProcessState.STOPPED)


@pytest.mark.parametrize("count_text,status", [("no number\n", 0), ("collected 100 items\n", 143)])
def test_an_allowed_run_stopped_by_an_unknown_count_before_it_starts_keeps_its_permission(allowed, count_text, status):
    stop_run_at_count(allowed, count_text, status)
    expect_requests(allowed, RunRequest(1, TEST_LINE, WHY, "allowed"))
    allowed.story.expect_text("task inspect 1 --json", "request 1 was not used", actor=allowed.story.agent)
    expect_reply_allowed(allowed.run_test())
    expect_requests(allowed, RunRequest(1, TEST_LINE, WHY, "used"))


def test_an_allowed_run_stopped_for_having_too_many_tests_before_it_starts_keeps_its_permission(allowed):
    allowed.story.run("setting set journal.suites.coding.workers.worker-run-most-tests 5 --environment main")
    stop_run_at_count(allowed, "\nJOURNAL_COUNT_PART_1\ncollected 8 items\n", 0)
    expect_requests(allowed, RunRequest(1, TEST_LINE, WHY, "allowed"))


def test_an_allowed_run_that_started_stays_used_when_it_is_stopped(allowed):
    install_runner(allowed.story)
    expect_reply_allowed(allowed.run_test())
    process = allowed.story.container.get(Queries).query(Process).filter(session_agent_id=allowed.worker.id).newest().first()
    allowed.story.container.get(Bus).run(GrantRunSlots(), allowed.story.agent, environment_id=1)
    allowed.story.run(f"process stop {process.id}", actor=allowed.worker)
    expect_requests(allowed, RunRequest(1, TEST_LINE, WHY, "used"))
