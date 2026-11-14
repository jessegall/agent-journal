import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.support.fixtures import AgentStarted

UNANSWERABLE = "nobody can answer a question asked from here"


@pytest.mark.parametrize("role", ["worker", "helper", "reviewer", "verifier"])
def test_a_helper_of_any_other_role_is_refused(new_story, role):
    story = new_story(fixture=AgentStarted)
    helper = Actor(story.new_row_id(f"agent start s-9 claude {role} --environment main"), ActorType.AGENT)
    story.expect_refusal('question ask "Which database?" --context "A story asks this so its card and answer can be checked." --environment main', UNANSWERABLE, actor=helper)
