import pytest

from core.modules.processes.commands.end_process.end_process import EndProcess
from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.processes.support.process_samples import BYTES_LONG, BYTES_SHORT, start_process_of

PROCESS = "process show 1"
PARTS = "process-part list --process 1 --oldest"
OUTPUTS = "output list --process 1"


@pytest.fixture
def agent(journal) -> Actor:
    return Actor(journal.new_row_id("agent start s-1 claude main --environment main"), ActorType.AGENT)


def text_of(journal, line: str, actor: Actor | None = None) -> str:
    answer = journal.run(line, actor)
    assert answer.code == 0, (line, answer.text)
    return answer.text


def end_process(journal, agent: Actor, process_id: int, byte_count: int, line_count: int) -> None:
    journal.container.get(Bus).run(EndProcess(process_id, 0, byte_count, line_count), agent, environment_id=1)


def test_starting_a_process_makes_it_running_with_one_part_for_each_command_of_its_line(journal, agent):
    started = start_process_of(journal, agent, "make test && echo done")
    assert started.id == 1
    shown = text_of(journal, PROCESS)
    assert "state: running" in shown and "line: make test && echo done" in shown and "limit_seconds: 30" in shown, shown
    parts = text_of(journal, PARTS)
    assert parts.index("make test") < parts.index("echo done") and "waiting" in parts, parts


def test_long_and_short_runs_both_keep_their_output(journal, agent):
    start_process_of(journal, agent, "make test && echo done")
    start_process_of(journal, agent, "make build")
    end_process(journal, agent, 1, BYTES_LONG, 80)
    end_process(journal, agent, 2, BYTES_SHORT, 1)
    assert "kept" in text_of(journal, OUTPUTS)
    shown = text_of(journal, "output show 1")
    assert all(text in shown for text in ("process_id: 1", f"byte_count: {BYTES_LONG}", "line_count: 80", "state: kept")), shown
    assert "kept" in text_of(journal, "output list --process 2")


def test_outputs_have_no_independent_prune_command(journal, agent):
    start_process_of(journal, agent, "make test && echo done")
    end_process(journal, agent, 1, BYTES_LONG, 80)
    assert "prune" not in journal.run("output --help", agent).text


def test_the_parts_of_a_process_go_with_it(journal, agent):
    start_process_of(journal, agent, "make test && echo done")
    assert "make test" in text_of(journal, PARTS)
    end_process(journal, agent, 1, BYTES_LONG, 80)
    journal.run("process delete 1", agent)
    assert "nothing found" in journal.run(PARTS).text
