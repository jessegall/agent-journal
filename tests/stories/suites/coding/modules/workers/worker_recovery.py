from datetime import timedelta

from engine.command.bus import Bus
from engine.tasks.clear_delegated_tasks import ClearDelegatedTasks
from engine.actor.actor import Actor
from engine.journal.journal_home import LAUNCHER_SOCKET
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.agents.support.launcher_service import LauncherService
from core.modules.agents.testing.fake_launcher import FakeLauncher
from suites.coding.modules.workers.ticks.gone_worker_recovery import GoneWorkerRecovery
from tests.stories.suites.coding.modules.workers.gone_workers import RESUMED_PID, WORKER_PID, missing_program, running_worker, start_launcher, worker_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker

__all__ = ["no_program_on_the_machine", "running_worker", "worker_story"]


class StartedLauncherService:
    """Stands in for starting the launcher service: starting it opens a launcher on the socket that answers
    with a pid."""

    def __init__(self, story, monkeypatch) -> None:
        self.story, self.launcher = story, None
        monkeypatch.setattr(LauncherService, "start", lambda service: self.start())

    def start(self) -> bool:
        self.launcher = FakeLauncher.listening(self.story.home.socket(LAUNCHER_SOCKET), answer=f"started {WORKER_PID}\n".encode())
        return True


def stale_socket(story) -> None:
    start_launcher(story, b"").server.close()
    assert story.home.socket(LAUNCHER_SOCKET).exists()


def test_a_launch_over_a_socket_nobody_answers_removes_it_and_goes_on_with_a_launcher_started_in_its_place(worker_story, monkeypatch):
    story = worker_story
    stale_socket(story)
    service = StartedLauncherService(story, monkeypatch)
    worker = dispatched_worker(story)
    story.run_listeners()
    service.launcher.drain_requests()
    story.expect_rows(len(service.launcher.starts) == 1, service.launcher.starts[0]["agent_id"] == worker.id)
    story.expect_text(f"agent show {worker.id}", f"pid: {WORKER_PID}")


def test_a_stop_over_a_socket_nobody_answers_removes_it_and_starts_no_launcher(worker_story, monkeypatch):
    story = worker_story
    stale_socket(story)
    service = StartedLauncherService(story, monkeypatch)
    stopped = story.container.get(LauncherLink).stop(99)
    story.expect_rows(not stopped, service.launcher is None, not story.home.socket(LAUNCHER_SOCKET).exists())


def test_a_worker_gone_when_the_server_starts_is_ended_and_resumed_at_once(running_worker):
    story = running_worker
    story.use_processes()
    launcher = start_launcher(story, f"started {RESUMED_PID}\n".encode())
    GoneWorkerRecovery()(story.container)
    launcher.drain_requests()
    story.expect_rows(len(launcher.starts) == 1, launcher.starts[0]["agent_id"] == story.worker.id)
    story.expect_text(f"agent show {story.worker.id}", f"pid: {RESUMED_PID}")
    story.expect_no_text(f"agent show {story.worker.id}", "ended_at:")


def test_a_worker_running_when_the_server_starts_is_left_alone(running_worker):
    story = running_worker
    launcher = start_launcher(story, b"running\n")
    GoneWorkerRecovery()(story.container)
    story.expect_rows(launcher.requests == [])
    story.expect_no_text(f"agent show {story.worker.id}", "ended_at:")


def test_a_worker_with_started_work_and_no_job_or_delegated_task_is_resumed(running_worker):
    story = running_worker
    story.container.get(Bus).run(ClearDelegatedTasks(story.worker.id), Actor.core(), environment_id=1)
    story.use_processes()
    story.tick("s-1")
    story.advance(timedelta(seconds=1))
    story.expect_rows(story.row(Agent, story.worker.id).ended_at is not None)
    launcher = start_launcher(story, f"started {RESUMED_PID}\n".encode())
    GoneWorkerRecovery()(story.container)
    launcher.drain_requests()
    story.expect_rows(len(launcher.starts) == 1, launcher.starts[0]["agent_id"] == story.worker.id)
    story.expect_text(f"agent-line list --agent {story.worker.id}", "you ended with tasks left")
