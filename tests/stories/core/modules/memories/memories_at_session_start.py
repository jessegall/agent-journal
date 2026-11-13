from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.modules.memories.support.memory_nudges import START_MEMORIES
from engine.testing.expectations.expected_nudge import expected_nudge

SESSION_START = HookSamples.session_start()


def four_memories(story) -> None:
    story.run('memory make "The cart total is in cents" --weight 4 --environment main', actor=story.agent)
    story.run('memory make "The checkout runs in euros" --weight 8 --environment main', actor=story.agent)
    story.run('memory make "Log after each step" --environment main', actor=story.agent)
    story.run('memory make "Always run the tests before a commit" --environment main', actor=story.agent)


def test_a_session_start_gives_reminders_then_facts_heaviest_first(new_story):
    story = new_story(fixture=BuilderStarted)
    four_memories(story)
    story.expect_hook_allowed("s-1", SESSION_START, expected_nudge(START_MEMORIES, count=4))
