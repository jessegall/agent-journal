import pytest

from engine.time.clock import Clock
from core.base.database.database import Database
from core.base.driver.tool_type import ToolType
from engine.query.queries import Queries
from core.modules.drivers.models.hook_call import SUMMARY_CHARACTERS, HookCall
from core.testing.hook_samples import HookSamples
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from tests.stories.core.support.fixtures import UserJoined


def summed_statements(story, question_call) -> list[str]:
    statements: list[str] = []
    story.container.get(Database).connection.set_trace_callback(statements.append)
    question_call(story.container.get(HookCallQuery), story.agent.id)
    return [statement for statement in statements if "sum(version)" in statement and "hook_calls" in statement]


@pytest.mark.parametrize("question", ["is_idle", "is_compacting"])
def test_asking_about_an_agents_newest_hook_adds_up_none_of_its_hooks(new_story, question):
    story = new_story(fixture=UserJoined)
    story.expect_rows(not summed_statements(story, lambda calls, agent: getattr(calls, question)(agent, story.container.get(Clock).timestamp())))


def test_the_newest_hook_adds_up_none_of_the_agents_hooks(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_rows(not summed_statements(story, lambda calls, agent: calls.newest_agent_hook(agent)))


def test_a_file_read_from_a_long_path_keeps_its_file_name_in_the_call_summary(new_story):
    story = new_story(fixture=UserJoined)
    path = f"/work/{'deep/' * 60}.claude/skills/journal-notes/SKILL.md"
    sample = HookSamples.sample("pre_tool_use", {"name": "Read", "category": ToolType.READ, "files": [path], "diff": None})
    story.hook("s-1", sample)
    call = story.container.get(Queries).query(HookCall).newest().first()
    story.expect_rows(len(path) > SUMMARY_CHARACTERS, call.summary.endswith("journal-notes/SKILL.md"))
