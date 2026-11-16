import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder

WORKER_SESSION = "w-lists"


@pytest.fixture
def worker_story(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    worker = Actor(story.new_row_id(f"agent start {WORKER_SESSION} claude worker --parent {story.agent.id} --environment main"), ActorType.AGENT)
    story.expect_success(lines.TASK_START, actor=worker)
    return story, worker
