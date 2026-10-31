import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.support.fixtures import AgentStarted

NOBODY = "nobody can answer a question asked from here"


def test_the_main_agent_asks(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_success('question ask "Which database?" --environment main', "question 1 asked; waiting for the answer", actor=story.agent)


@pytest.mark.parametrize("role", ["worker", "subagent", "reviewer", "verifier"])
def test_a_helper_of_any_other_role_is_refused(new_story, role):
    story = new_story(fixture=AgentStarted)
    helper = Actor(story.new_row_id(f"agent start s-9 claude {role} --environment main"), ActorType.AGENT)
    story.expect_refusal('question ask "Which database?" --environment main', NOBODY, actor=helper)


def test_the_user_is_refused(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal('question ask "Which database?" --environment main', NOBODY, actor=story.user)
