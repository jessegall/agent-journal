import pytest

from core.base.command.bus import Bus
from core.base.query.queries import Queries
from core.modules.processes.commands.grant_run_slots.grant_run_slots import GrantRunSlots
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.expect_reply import expect_reply_allowed
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.suites.coding.modules.workers.phase_test_requests import REASON, allowed, expect_requests, planned_worker, requested  # noqa: F401  (fixtures)
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, RunRequest


def count_stop_run(allowed, count_text: str, status: int) -> None:
    install_runner(allowed.story)
    expect_reply_allowed(allowed.run_test())
    expect_requests(allowed, RunRequest(1, TEST_LINE, REASON, "used"))
    process = allowed.story.container.get(Queries).query(Process).filter(session_agent_id=allowed.worker.id).newest().first()
    allowed.story.container.get(OutputFolder).write_count(process.id, count_text, status)
    allowed.story.container.get(Bus).run(GrantRunSlots(), allowed.story.agent, environment_id=1)
    allowed.story.expect_rows(allowed.story.container.get(Queries).query(Process).find(process.id).state is ProcessState.STOPPED)


def test_an_allowed_run_that_started_stays_used_when_it_is_stopped(allowed):
    install_runner(allowed.story)
    expect_reply_allowed(allowed.run_test())
    process = allowed.story.container.get(Queries).query(Process).filter(session_agent_id=allowed.worker.id).newest().first()
    allowed.story.container.get(Bus).run(GrantRunSlots(), allowed.story.agent, environment_id=1)
    allowed.story.run(f"process stop {process.id}", actor=allowed.worker)
    expect_requests(allowed, RunRequest(1, TEST_LINE, REASON, "used"))
