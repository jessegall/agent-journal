from types import SimpleNamespace

from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.rules.stopped_worker_rule import StoppedWorkerRule
from suites.coding.modules.workers.nudges.worker_asking_stopped_nudge import WorkerAskingStoppedNudge

ENDED = Timestamp.parsed("2026-11-14T10:00:00+00:00")
LATER = Timestamp.parsed("2026-11-14T12:00:00+00:00")
WORKER = SimpleNamespace(id=7, number=868, ended_at=ENDED)


class Settings:
    def number(self, key: str) -> int:
        return 4

    def minutes(self, key: str):
        return SimpleNamespace(count=60)


class StartedWork:
    """One stopped worker that holds no open or started task: only a task in testing waits on a merge."""

    def stopped_workers(self):
        return [WORKER]

    def with_tasks(self, workers):
        return []


class Unfinished:
    def rows(self, worker_id: int):
        return ()

    def committed(self, worker_id: int):
        return (SimpleNamespace(id=9364),)

    @staticmethod
    def names(tasks) -> str:
        return ", ".join(f"task:{task.id}" for task in tasks)


class Escalations:
    def __init__(self, is_open: bool) -> None:
        self.open = is_open

    def is_open(self, worker_id: int) -> bool:
        return self.open


class Stop:
    def was_stopped(self, worker) -> bool:
        return False


def answer(question_open: bool):
    rule = StoppedWorkerRule(None, Stop(), Unfinished(), StartedWork(), Settings(), None, Escalations(question_open))
    return rule.answer(SimpleNamespace(timestamp=LATER))


def test_a_stopped_worker_whose_question_went_to_the_main_agent_is_named_with_its_committed_task():
    nudges = answer(question_open=True).nudges
    assert [nudge.key for nudge in nudges] == [f"{WorkerAskingStoppedNudge.declared().key}.{WORKER.id}"] and "task:9364" in nudges[0].text, nudges


def test_a_stopped_worker_with_no_open_question_and_no_open_task_is_not_named():
    assert answer(question_open=False).nudges == ()
