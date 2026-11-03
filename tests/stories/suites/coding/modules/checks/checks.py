from core.testing.story_fixture import StoryFixture

import json
from datetime import timedelta

from core.base.periodic_checks import PeriodicChecks
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.fixtures import UserJoined


def test_a_check_is_made_run_by_hand_and_listed_with_its_verdict(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('check make "Suite" --command "true" --every 0', "check 1: Suite", actor=story.user)
    story.expect_text("check run 1", "check 1 passed: Suite", actor=story.user)
    story.expect_text("check list", "passed", "Suite", actor=story.user)


def test_a_failing_check_prints_its_output_and_tells_the_agent_once(new_story):
    story = new_story(fixture=SuiteCheck)
    story.expect_text("check run 1", "check 1 failed: Lint", "two problems", actor=story.user)
    story.expect_hook_allowed("s-1", HookSamples.stop(), "check:1 failed")


def test_the_runs_of_a_check_are_listed_newest_first_with_what_each_printed(new_story):
    story = new_story(fixture=SuiteCheck)
    story.run("check run 1", actor=story.user)
    story.advance(timedelta(minutes=1))
    story.run('check edit 1 --command "echo clean"', actor=story.user)
    story.run("check run 1", actor=story.user)
    runs = json.loads(story.run("check runs 1 --json", actor=story.user).output_text)["rows"]
    assert [run["passed"] for run in runs] == [True, False]
    assert "clean" in runs[0]["output"] and "two problems" in runs[1]["output"]


def test_a_check_that_never_ran_has_no_runs(new_story):
    story = new_story(fixture=UserJoined)
    story.run('check make "Suite" --command "true" --every 0', actor=story.user)
    story.expect_text("check runs 1", "no runs yet", actor=story.user)


def test_a_removed_check_runs_no_more_and_says_so(new_story):
    story = new_story(fixture=UserJoined)
    story.run('check make "Suite" --command "true" --every 0', actor=story.user)
    story.expect_text("check remove 1", "check 1 removed: it runs no more", actor=story.user)
    story.expect_refusal("check remove 1", "check 1 is removed already", actor=story.user)


def test_check_create_makes_a_check_as_version_4_plugins_still_call_it(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('check create "Suite" --command "true" --every 0', "check 1: Suite", actor=story.user)


def test_a_due_check_runs_on_the_periodic_round_and_never_in_a_hook(new_story):
    story = new_story(fixture=UserJoined)
    story.run('check make "Suite" --command "true" --every 1', actor=story.user)
    story.advance(timedelta(minutes=2))
    story.hook("s-1", HookSamples.stop())
    story.expect_absent("check list", "passed", actor=story.user)
    story.container.get(PeriodicChecks).run()
    story.expect_text("check list", "passed", "Suite", actor=story.user)


def test_a_stopped_check_is_not_run_by_hand(new_story):
    story = new_story(fixture=UserJoined)
    story.run('check make "Suite" --command "true" --every 0', actor=story.user)
    story.run("check stop 1", actor=story.user)
    story.expect_refusal("check run 1", "check 1 is stopped", actor=story.user)


def test_a_check_that_ended_has_no_percent_left_on_its_row(new_story):
    story = new_story(fixture=UserJoined)
    story.run('check make "Suite" --command "echo 1/4"', actor=story.user)
    story.run("check run 1", actor=story.user)
    assert json.loads(story.run("check show 1 --json", actor=story.user).output_text)["run_percent"] is None


class SuiteCheck(StoryFixture):
    parent = UserJoined

    def steps(self, story):
        story.run('check make "Lint" --command "echo two problems; false" --every 0', actor=story.user)
