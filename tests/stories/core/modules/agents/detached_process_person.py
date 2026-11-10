from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.caller.caller_request import CallerRequest
from core.base.caller.process_row import ProcessRow
from engine.time.timestamp import Timestamp
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import ProcessAgent

DETACHED_START_TIME = Timestamp.parsed("2026-10-31T11:00:00+00:00")
TASK_LINE = 'task make "Fix the cart"'


class AgentAndPerson(StoryFixture):
    """An agent session s-7 as pid 700, and a person with login ada: story.agent and story.user."""

    parent = ProcessAgent

    def steps(self, story) -> None:
        story.user = Actor(story.new_row_id('actor make user "ada"'), ActorType.USER)


def test_a_detached_process_with_no_session_variable_is_the_person(new_story):
    story = new_story(fixture=AgentAndPerson)
    story.use_processes(ProcessRow(900, 1, DETACHED_START_TIME), ProcessRow(1, 0, DETACHED_START_TIME))
    story.expect_requested_success(TASK_LINE, CallerRequest({"USER": "ada"}, "/work/journal/src", pid=900), f"creator_id: {story.user.id}", "environment_id: 1")
