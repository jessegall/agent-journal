import json

import pytest

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import UserBuilder

SESSION_START = HookSamples.session_start()
RESUMED_START = SESSION_START.with_raw({"source": "resume"})


@pytest.fixture
def remembering(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success('memory make "The cart total is in cents" --environment main', actor=story.agent)
    story.expect_success('memory make "The checkout runs in euros" --environment main', actor=story.agent)
    story.hook("s-1", SESSION_START)
    story.run_listeners()
    story.expect_rows(start_deliveries(story) == [1, 2], detail=str(start_deliveries(story)))
    return story


def start_deliveries(story) -> list[int]:
    rows = json.loads(story.run("memory-delivery list --oldest --json", actor=story.user).output_text)["rows"]
    return [row["memory_id"] for row in rows if row["cause"] == "start" and row["session_agent_id"] == story.agent.id]


def test_an_agent_whose_session_was_replaced_is_given_its_memories_again_at_its_next_start(remembering):
    replaced_id = remembering.new_row_id("agent start s-2 claude main --environment main")
    remembering.hook("s-2", SESSION_START)
    remembering.run_listeners()
    remembering.expect_rows(replaced_id == remembering.agent.id, start_deliveries(remembering) == [1, 2, 1, 2], detail=str(start_deliveries(remembering)))


def test_a_resumed_session_is_not_given_the_memories_it_already_has(remembering):
    remembering.hook("s-1", RESUMED_START)
    remembering.run_listeners()
    remembering.expect_rows(start_deliveries(remembering) == [1, 2], detail=str(start_deliveries(remembering)))
