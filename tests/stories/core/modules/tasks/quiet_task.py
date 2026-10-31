from datetime import timedelta

from core.modules.tasks.quiet_task_reminder import QUIET_MINUTES
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask


def test_a_builder_quiet_with_its_task_in_hand_is_reminded_on_a_tick(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.advance(timedelta(minutes=QUIET_MINUTES))
    story.tick("s-1")
    story.expect_text(f"agent-line list --agent {story.agent.id} --state waiting", f"nothing has happened for {QUIET_MINUTES} minutes", "tasks.quiet-task")


def test_a_builder_quiet_for_less_is_not_reminded(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.advance(timedelta(minutes=QUIET_MINUTES - 1))
    story.tick("s-1")
    story.expect_absent(f"agent-line list --agent {story.agent.id} --state waiting", "nothing has happened")


def test_a_quiet_reminder_reaches_the_agent_with_its_next_hook(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.advance(timedelta(minutes=QUIET_MINUTES))
    story.tick("s-1")
    story.expect_hook_allowed("s-1", HookSamples.prompt("and on"), f"nothing has happened for {QUIET_MINUTES} minutes")



def test_a_builder_is_reminded_by_a_tick_that_comes_late(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.advance(timedelta(minutes=QUIET_MINUTES + 2))
    story.tick("s-1")
    story.expect_text(f"agent-line list --agent {story.agent.id} --state waiting", f"nothing has happened for {QUIET_MINUTES} minutes")


def test_a_builder_is_reminded_once_per_quiet_stretch(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.advance(timedelta(minutes=QUIET_MINUTES))
    story.tick("s-1")
    story.advance(timedelta(minutes=1))
    story.tick("s-1")
    reply = story.hook("s-1", HookSamples.prompt("and on"))
    story.expect_rows(sum("nothing has happened" in line for line in reply.lines) == 1)
