import json
import shlex

from engine.driver.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined

REFUSING_STEPS = [{"refused_commands": ["plan ready"]}, {}]
REFUSAL = "does not allow this command"


def journal_sample(line: str):
    arguments = line.split()
    return HookSamples.shell(f"journal {line}", ShellPart("journal", CommandCategory.JOURNAL, arguments, subcommand=arguments[0]))


class RefusingStep(StoryFixture):
    """The agent is on step 1, which refuses `plan ready`."""

    parent = UserJoined

    def steps(self, story) -> None:
        story.expect_success(f'sequence make "Planning" --steps "Think | Finish" --step-guards {shlex.quote(json.dumps(REFUSING_STEPS))}', actor=story.user)
        story.expect_success("sequence run 1", actor=story.agent)
        story.expect_success("sequence follow", actor=story.agent)


class AfterTheRefusingStep(StoryFixture):
    """The agent moved on to step 2, which refuses nothing."""

    parent = RefusingStep

    def steps(self, story) -> None:
        story.expect_success("sequence next", actor=story.agent)
        story.expect_success("sequence follow", actor=story.agent)


def test_a_listed_command_at_the_end_of_a_chain_is_refused(new_story):
    story = new_story(fixture=RefusingStep)
    sample = HookSamples.shell("journal task list && journal plan ready 1", ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"], subcommand="task"), ShellPart("journal", CommandCategory.JOURNAL, ["plan", "ready", "1"], subcommand="plan"))
    story.expect_hook_refusal("s-1", sample, REFUSAL)


def test_a_command_the_step_does_not_list_goes_through(new_story):
    story = new_story(fixture=RefusingStep)
    story.expect_hook_allowed("s-1", journal_sample("task list"))


def test_the_next_step_no_longer_refuses_it(new_story):
    story = new_story(fixture=AfterTheRefusingStep)
    story.expect_hook_allowed("s-1", journal_sample("plan ready 1"))


def test_giving_the_sequence_up_ends_the_refusal(new_story):
    story = new_story(fixture=RefusingStep)
    story.expect_success('sequence abandon --why "called off" --sure', actor=story.agent)
    story.expect_hook_allowed("s-1", journal_sample("plan ready 1"))


def test_a_file_edit_is_not_a_command_the_step_can_list(new_story):
    story = new_story(fixture=RefusingStep)
    story.expect_hook_allowed("s-1", HookSamples.edit("cart.py"))
