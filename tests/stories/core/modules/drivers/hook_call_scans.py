import pytest

from core.base.clock import Clock
from core.base.database.database import Database
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
