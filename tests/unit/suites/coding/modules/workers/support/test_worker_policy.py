from dataclasses import replace
from types import SimpleNamespace

import pytest

from core.modules.agents.models.agent import Agent
from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.support.worker_policy import WorkerPolicy

ENDED_AT = Timestamp.parsed("2026-10-31T09:00:00+00:00")
WORKER = Agent(id=41, creator_id=1, session="s-1", program="claude", role="worker", number=2, profile="journal-worker")
ENDED_WORKER = replace(WORKER, ended_at=ENDED_AT)
ENDED_HELPER = replace(ENDED_WORKER, id=42, role="helper", profile="")
JOB = SimpleNamespace(id=7)


class FakeLineQuery:
    """Answers the read of a worker's waiting job lines with the lines it was given."""

    def __init__(self, lines: tuple) -> None:
        self.lines = lines

    def filter(self, **columns: object) -> "FakeLineQuery":
        return self

    def matching(self, condition: object) -> "FakeLineQuery":
        return self

    def get(self) -> tuple:
        return self.lines


def policy(stopped: bool, jobs: tuple = ()) -> WorkerPolicy:
    worker_stop = SimpleNamespace(was_stopped=lambda worker: stopped, is_job_due=lambda worker, work: not stopped)
    return WorkerPolicy(SimpleNamespace(), worker_stop, SimpleNamespace(query=lambda model: FakeLineQuery(jobs)))


@pytest.mark.parametrize("agent, stopped, jobs, wanted, final, messages", [
    (ENDED_WORKER, False, tuple([JOB]), True, False, True),
    (ENDED_WORKER, False, (), False, False, True),
    (ENDED_WORKER, True, tuple([JOB]), False, True, True),
    (WORKER, False, tuple([JOB]), False, False, True),
    (ENDED_HELPER, False, tuple([JOB]), False, True, False),
])
def test_the_workers_policy_wants_an_ended_worker_with_a_job_it_may_take_and_calls_final_only_a_worker_stopped_on_purpose(agent, stopped, jobs, wanted, final, messages):
    decided = policy(stopped, jobs)
    assert (decided.is_wanted(agent), decided.is_final(agent), decided.takes_messages(agent)) == (wanted, final, messages)
