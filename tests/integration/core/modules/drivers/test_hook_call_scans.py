import pytest

from core.modules.drivers.models.hook_call import SUMMARY_CHARACTERS, HookCall
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from engine.enums.tool_type import ToolType
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from engine.time.clock import Clock

MAIN_AGENT_START = "agent start s-1 claude main --environment main"


def summed_statements(journal, question_call) -> list[str]:
    agent_id = journal.new_row_id(MAIN_AGENT_START)
    statements: list[str] = []
    journal.database.connection.set_trace_callback(statements.append)
    question_call(journal.container.get(HookCallQuery), agent_id)
    journal.database.connection.set_trace_callback(None)
    return [statement for statement in statements if "sum(version)" in statement and "hook_calls" in statement]


@pytest.mark.parametrize("question", ["is_idle", "is_compacting"])
def test_asking_about_an_agents_newest_hook_adds_up_none_of_its_hooks(journal, question):
    assert not summed_statements(journal, lambda calls, agent: getattr(calls, question)(agent, journal.container.get(Clock).timestamp()))


def test_the_newest_hook_adds_up_none_of_the_agents_hooks(journal):
    assert not summed_statements(journal, lambda calls, agent: calls.newest_agent_hook(agent))


def test_a_file_read_from_a_long_path_keeps_its_file_name_in_the_call_summary(journal):
    journal.new_row_id(MAIN_AGENT_START)
    path = f"/work/{'deep/' * 60}.claude/skills/journal-notes/SKILL.md"
    journal.hook("s-1", HookSamples.sample("pre_tool_use", {"name": "Read", "category": ToolType.READ, "files": [path], "diff": None}))
    call = journal.container.get(Queries).query(HookCall).newest().first()
    assert len(path) > SUMMARY_CHARACTERS and call.summary.endswith("journal-notes/SKILL.md")
