from engine.actor.actor import Actor
from engine.journal.journal_home import LAUNCHER_SOCKET
from core.modules.agents.models.agent import Agent
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.agents.ticks.agent_reconcile import AgentReconcile
from tests.stories.suites.coding.modules.workers.gone_workers import missing_program, running_worker, worker_story

__all__ = ["missing_program", "running_worker", "worker_story"]

CORRECTION = "was ended while its program runs: its row is open again"


def test_545_a_worker_the_journal_ended_while_the_launcher_has_its_program_is_open_again_after_one_tick_and_the_correction_is_recorded(running_worker):
    story = running_worker
    story.home.socket(LAUNCHER_SOCKET).unlink(missing_ok=True)
    launcher = FakeLauncher.accepting(story.home.socket(LAUNCHER_SOCKET), answer=b"running\n", request_count=0)
    story.expect_success(f"agent end {story.worker.id}", actor=Actor.core())
    AgentReconcile()(story.container)
    launcher.server.close()
    story.expect_rows(story.row(Agent, story.worker.id).ended_at is None, CORRECTION in story.system_log_text(), detail=story.system_log_text()[-300:])
