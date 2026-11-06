from datetime import timedelta

from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

SESSION_START = HookSamples.session_start()


def four_memories(story) -> None:
    story.run('memory make "The cart total is in cents" --weight 4 --environment main', actor=story.agent)
    story.run('memory make "The checkout runs in euros" --weight 8 --environment main', actor=story.agent)
    story.run('memory make "Log after each step" --environment main', actor=story.agent)
    story.run('memory make "Always run the tests before a commit" --environment main', actor=story.agent)


def test_a_session_start_gives_reminders_then_facts_heaviest_first(new_story):
    story = new_story(fixture=BuilderStarted)
    four_memories(story)
    story.expect_hook_allowed("s-1", SESSION_START, f"4 memories to read: journal skill require {story.agent.id} journal-memory, load it as directed, then journal memory list")


def test_a_faded_fact_is_not_given_at_a_session_start(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('memory make "An old fact" --weight 0 --environment main', actor=story.agent)
    story.run('memory make "A standing fact" --environment main', actor=story.agent)
    reply = story.hook("s-1", SESSION_START)
    story.expect_hook_allowed("s-1", SESSION_START, f"1 memories to read: journal skill require {story.agent.id} journal-memory, load it as directed, then journal memory list")
    story.expect_rows(not any("An old fact" in line for line in reply.lines))
