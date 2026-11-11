from types import SimpleNamespace

import pytest

from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger
from suites.coding.modules.workers.commands.start_merger.start_merger_handler import StartMergerHandler

CONTEXT = SimpleNamespace(environment_id=3)


class KeptMergerQuery:
    def __init__(self, kept) -> None:
        self.kept = kept

    def query(self, model):
        return self

    def filter(self, **fields):
        return self

    def matching(self, condition):
        return self

    def newest(self):
        return self

    def first(self):
        return self.kept


class RecordingBus:
    def __init__(self) -> None:
        self.commands: list[object] = []

    def run(self, command, actor, environment_id):
        self.commands.append(command)


def commands_of_a_start(kept) -> list[object]:
    bus = RecordingBus()
    agents = SimpleNamespace(main_agent=lambda: SimpleNamespace(id=1))
    StartMergerHandler(KeptMergerQuery(kept), bus, agents, SimpleNamespace()).handle(StartMerger("a worker handed in"), CONTEXT)
    return bus.commands


@pytest.mark.parametrize("program,model", [("claude", "sonnet"), ("codex", "gpt-6.1-terra"), ("claude", "a-model-no-profile-lists")])
def test_an_ended_merger_on_any_program_is_sent_the_job_and_nobody_is_retired(program, model):
    commands = commands_of_a_start(SimpleNamespace(id=9, program=program, program_model=model, ended_at="2026-11-10 10:00:00"))
    assert [type(command).__name__ for command in commands] == ["SendHelper"]
    assert (commands[0].helper_id, commands[0].steer) == (9, False)


def test_a_running_merger_gets_a_steering_line():
    commands = commands_of_a_start(SimpleNamespace(id=9, program="codex", program_model="gpt-6.1-terra", ended_at=None))
    assert [(type(command).__name__, command.steer) for command in commands] == [("SendHelper", True)]


def test_with_no_kept_merger_one_is_started():
    assert [type(command).__name__ for command in commands_of_a_start(None)] == ["StartHelper"]
