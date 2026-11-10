from engine.testing.stories.story_fixture import StoryFixture

import json
import shlex

from engine.driver.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.fixtures import UserJoined

CHECKED_STEPS = [{"checks": [1]}, {"checks": [1]}]


class FailedCheckSequence(StoryFixture):
    """A failing check 1, a two step sequence whose steps both list it, and the agent on step 1."""

    parent = UserJoined

    def steps(self, story):
        story.run('check make "Suite" --command "false" --every 0', actor=story.user)
        story.run(f'sequence make "Release" --steps "Run the suite | Tag the release" --step-guards {shlex.quote(json.dumps(CHECKED_STEPS))}', actor=story.user)
        story.run("sequence run 1", actor=story.agent)
        story.run("sequence follow", actor=story.agent)


class PassedCheckSequence(StoryFixture):
    """The same run, with check 1 changed to pass and run."""

    parent = FailedCheckSequence

    def steps(self, story):
        story.run('check edit 1 --command "true"', actor=story.user)
        story.run("check run 1", actor=story.user)


def test_a_step_does_not_advance_while_a_check_it_lists_has_not_passed(new_story):
    story = new_story(fixture=FailedCheckSequence)
    story.run("check run 1", actor=story.user)
    story.expect_refusal("sequence next", "step 1 of sequence 1 waits on checks that have not passed: check 1", actor=story.agent)
    story.expect_refusal("sequence next", "journal check run 1", actor=story.agent)


def test_the_sequence_does_not_finish_while_the_check_of_its_last_step_fails(new_story):
    story = new_story(fixture=PassedCheckSequence)
    story.run("sequence next", actor=story.agent)
    story.run("sequence follow", actor=story.agent)
    story.run('check edit 1 --command "false"', actor=story.user)
    story.run("check run 1", actor=story.user)
    story.expect_refusal("sequence next", "step 2 of sequence 1 waits on checks that have not passed: check 1", actor=story.agent)
    story.run('check edit 1 --command "true"', actor=story.user)
    story.run("check run 1", actor=story.user)
    story.expect_text("sequence next", "sequence 1 ran its last step", actor=story.agent)


def test_a_check_that_never_ran_has_not_passed(new_story):
    story = new_story(fixture=FailedCheckSequence)
    story.expect_refusal("sequence next", "waits on checks that have not passed: check 1", actor=story.agent)


def test_a_check_that_does_not_exist_has_not_passed(new_story):
    story = new_story(fixture=UserJoined)
    story.run(f'sequence make "Release" --steps "Run the suite" --step-guards {shlex.quote(json.dumps([{"checks": [9]}]))}', actor=story.user)
    story.run("sequence run 1", actor=story.agent)
    story.run("sequence follow", actor=story.agent)
    story.expect_refusal("sequence next", "waits on checks that have not passed: check 9", actor=story.agent)


def test_abandoning_works_whatever_the_checks_say(new_story):
    story = new_story(fixture=FailedCheckSequence)
    story.expect_refusal('sequence abandon --why "not today"', "again with --sure", actor=story.agent)
    story.expect_text('sequence abandon --why "not today" --sure', "sequence 1 abandoned", actor=story.agent)
    story.expect_refusal("sequence next", "no sequence is running", actor=story.agent)


def test_a_step_with_no_checks_advances_as_before(new_story):
    story = new_story(fixture=UserJoined)
    story.run('sequence make "Release" --steps "Run the suite | Tag the release"', actor=story.user)
    story.run("sequence run 1", actor=story.agent)
    story.run("sequence follow", actor=story.agent)
    story.expect_text("sequence next", "sequence 1, step 2: Tag the release", actor=story.agent)


def test_the_step_line_and_sequence_show_name_the_checks(new_story):
    story = new_story(fixture=FailedCheckSequence)
    story.expect_text("sequence show 1", "1. Run the suite (checks that must pass: 1)", actor=story.user)
    story.expect_text("sequence follow", "these checks must pass before it moves on: check 1", actor=story.agent)


def test_a_sequence_a_command_starts_holds_its_first_step_on_a_failed_check(new_story):
    story = new_story(fixture=UserJoined)
    triggers = [{"trigger_type": "command", "pattern": "git tag"}]
    story.run('check make "Suite" --command "false" --every 0', actor=story.user)
    story.run(f'sequence make "Release" --steps "Run the suite" --triggers {shlex.quote(json.dumps(triggers))} --step-guards {shlex.quote(json.dumps(CHECKED_STEPS[:1]))}', actor=story.user)
    story.run("check run 1", actor=story.user)
    story.hook("s-1", HookSamples.shell("git tag v1", ShellPart("git", CommandCategory.READ, ["tag", "v1"])).with_fields(event="post_tool_use"))
    story.run("sequence follow", actor=story.agent)
    story.expect_refusal("sequence next", "step 1 of sequence 1 waits on checks that have not passed: check 1", actor=story.agent)
