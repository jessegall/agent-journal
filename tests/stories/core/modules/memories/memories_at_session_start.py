from datetime import timedelta

from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

SESSION_START = HookSamples.session_start()


def four_memories(story) -> None:
    story.run('memory make "The cart total is in cents" --type fact --weight 4 --environment main', actor=story.agent)
    story.run('memory make "The checkout runs in euros" --type fact --weight 8 --environment main', actor=story.agent)
    story.run('memory make "Log after each step" --type reminder --environment main', actor=story.agent)
    story.run('memory make "Always run the tests before a commit" --type rule --project')


def test_a_session_start_gives_rules_then_reminders_then_facts_heaviest_first(new_story):
    story = new_story(fixture=BuilderStarted)
    four_memories(story)
    story.expect_ordered_hook_lines("s-1", SESSION_START, "Always run the tests before a commit", "Log after each step", "The checkout runs in euros",
                                     "The cart total is in cents")


def test_a_faded_fact_is_not_given_at_a_session_start(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('memory make "An old fact" --type fact --weight 0 --environment main', actor=story.agent)
    story.run('memory make "A standing fact" --type fact --environment main', actor=story.agent)
    reply = story.hook("s-1", SESSION_START)
    story.expect_hook_allowed("s-1", SESSION_START, "A standing fact")
    story.expect_rows(not any("An old fact" in line for line in reply.lines))


def test_a_reminder_not_yet_due_is_not_given_at_a_session_start(new_story):
    story = new_story(fixture=BuilderStarted)
    due = (story.clock.timestamp().value + timedelta(hours=1)).isoformat()
    story.run(f'memory make "Deploy at nine" --type reminder --due {due} --environment main', actor=story.agent)
    story.run('memory make "Log after each step" --type reminder --environment main', actor=story.agent)
    reply = story.hook("s-1", SESSION_START)
    story.expect_rows(any("Log after each step" in line for line in reply.lines), not any("Deploy at nine" in line for line in reply.lines))
