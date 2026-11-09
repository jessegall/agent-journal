import json
import shlex

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined

REFUSING_STEPS = [{"refused_commands": ["plan ready"]}, {}]
REFUSAL = "does not allow this command"


def journal_sample(line: str):
    words = line.split()
    return HookSamples.shell(f"journal {line}", ShellPart("journal", CommandCategory.JOURNAL, words, subcommand=words[0]))


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


def test_a_step_refuses_the_command_it_lists(new_story):
    story = new_story(fixture=RefusingStep)
    story.expect_hook_refusal("s-1", journal_sample("plan ready 1"), REFUSAL)


def test_the_refusal_names_the_step_and_the_sequence(new_story):
    story = new_story(fixture=RefusingStep)
    story.expect_hook_refusal("s-1", journal_sample("plan ready 1"), "step 1 of sequence:1")


def test_a_listed_command_at_the_end_of_a_chain_is_refused(new_story):
    story = new_story(fixture=RefusingStep)
    sample = HookSamples.shell("journal task list && journal plan ready 1", ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"], subcommand="task"), ShellPart("journal", CommandCategory.JOURNAL, ["plan", "ready", "1"], subcommand="plan"))
    story.expect_hook_refusal("s-1", sample, REFUSAL)


def test_a_listed_command_inside_a_shell_of_its_own_is_refused(new_story):
    story = new_story(fixture=RefusingStep)
    sample = HookSamples.shell("sh -c 'journal plan ready 1'", ShellPart("sh", CommandCategory.UNKNOWN, ["-c", "journal plan ready 1"], nested_journal_commands=[["plan", "ready", "1"]]))
    story.expect_hook_refusal("s-1", sample, REFUSAL)


def test_a_command_the_step_does_not_list_goes_through(new_story):
    story = new_story(fixture=RefusingStep)
    story.expect_hook_allowed("s-1", journal_sample("task list"))


def test_the_sequence_commands_always_go_through(new_story):
    story = new_story(fixture=RefusingStep)
    story.expect_hook_allowed("s-1", journal_sample("sequence next"))


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


def test_refused_commands_that_are_no_list_are_refused_when_the_sequence_is_made(new_story):
    story = new_story(fixture=UserJoined)
    bad = json.dumps([{"refused_commands": "plan ready"}])
    story.expect_refusal(f'sequence make "Bad" --steps "One" --step-guards {shlex.quote(bad)}', "refused_commands", actor=story.user)


def test_a_condition_nobody_declared_is_refused_when_the_sequence_is_made(new_story):
    story = new_story(fixture=UserJoined)
    bad = json.dumps([{"conditions": ["plans.no-such-thing"]}])
    story.expect_refusal(f'sequence make "Bad" --steps "One" --step-guards {shlex.quote(bad)}', "plans.no-such-thing", actor=story.user)


def test_conditions_that_are_no_list_are_refused_when_the_sequence_is_made(new_story):
    story = new_story(fixture=UserJoined)
    bad = json.dumps([{"conditions": "plans.brief-set"}])
    story.expect_refusal(f'sequence make "Bad" --steps "One" --step-guards {shlex.quote(bad)}', "conditions", actor=story.user)
