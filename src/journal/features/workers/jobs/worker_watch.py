import json
import time

from journal.engine.job import Job
from journal.features.workers.support.worker_actions import WorkerActions
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.worker import JOB_MOVE, Worker
from journal.support.actor import Actor
from journal.repositories.scope import Scope

# what a worker the journal's restart stopped is told as it is started again in its own session
REVIVE_BRIEF = ("The journal restarted while you were at work, and your run stopped with it. Carry on with your job where you left "
                "off: your session, worktree and task are as you left them.")
# what a worker whose clock-out the journal's restart cut off is told as it is started again in its own session
CLOCK_OUT_AGAIN_BRIEF = ("The journal restarted while your clock-out ran its tests, and the clock-out stopped with it. Clock out again now, "
                         "with the same report and tests: your session, worktree and task are as you left them.")
# the last event of a run that ended on its own: Claude Code's result, Codex's end of its turn
ENDING_EVENTS = {"result", "turn.completed", "turn.failed"}
TAIL_BYTES = 65536
# a run whose output last moved longer ago than this before the boot was not cut off by this restart: its process had been gone
# already, and its work, if any, is long stale, so it is closed as before and never started again
REVIVE_WINDOW_SECONDS = 30 * 60


class WorkerWatch(Job):
    """Every two seconds, each worker the journal found still out at boot is checked: one whose process has ended has its report filed from its files, one past its time limit is stopped, so a restart never loses a worker. A worker whose run the restart cut off, its process gone with no end in its output and its output still moving in the half hour before the boot, is started again in its own session at the first look, so a restart never stops the work either; one whose process had been gone longer is only closed. A worker whose clock-out went on in the journal by itself when the restart came is started again in its own session and told to clock out again."""

    interval_seconds = 2.0

    def __init__(self, runner: WorkerRunner, scope: Scope, actions: WorkerActions) -> None:
        self.runner, self.scope, self.actions = runner, scope, actions
        self.watched: list[Worker] = []
        self.cut_off: set[int] = set()

    def add(self, worker: Worker) -> None:
        self.watched.append(worker)
        if worker.is_clocking_out() or (worker.pid > 0 and not self.runner.is_running(worker.pid) and self.was_at_work(worker) and not self.ended_on_its_own(worker)):
            self.cut_off.add(worker.id)

    def was_at_work(self, worker: Worker) -> bool:
        output = self.runner.outputs(worker)[0]
        return output.is_file() and time.time() - output.stat().st_mtime <= REVIVE_WINDOW_SECONDS

    def ended_on_its_own(self, worker: Worker) -> bool:
        output = self.runner.outputs(worker)[0]
        if not output.is_file():
            return False
        with output.open("rb") as read:
            read.seek(max(0, output.stat().st_size - TAIL_BYTES))
            lines = read.read().decode(errors="replace").splitlines()
        for line in reversed(lines):
            try:
                event = json.loads(line)
            except ValueError:
                continue
            if isinstance(event, dict):
                return event.get("type") in ENDING_EVENTS
        return False

    def tick(self, time: float) -> None:
        for worker in list(self.watched):
            with self.scope.environment(worker.environment_id):
                if worker.id in self.cut_off:
                    self.watched.remove(worker)
                    self.cut_off.discard(worker.id)
                    with self.runner.lock(worker.id):
                        self.actions.relaunch(self.actions.workers.find(worker.id), CLOCK_OUT_AGAIN_BRIEF if worker.is_clocking_out() else REVIVE_BRIEF, None, Actor.system(), JOB_MOVE)
                elif self.runner.is_finished(worker, Actor.system()):
                    self.watched.remove(worker)
