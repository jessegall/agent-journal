from core.testing.story_fixture import StoryFixture

import json
from datetime import timedelta

from core.base.periodic_checks import PeriodicChecks
from core.base.registry.registry import Registry
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.fixtures import UserJoined
from core.testing.expect_row import expect_row


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
    expect_passed_runs(runs, [True, False])
    expect_output_runs_with(runs, "clean")
    expect_output_runs_with_2(runs, "two problems")


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
    story = new_story(fixture=StoppedCheck)
    story.expect_refusal("check run 1", "check 1 is stopped", actor=story.user)


def test_a_person_starts_a_stopped_check_and_the_next_due_round_runs_it(new_story):
    story = new_story(fixture=UserJoined)
    story.run('check make "Suite" --command "true" --every 1', actor=story.user)
    story.run("check stop 1", actor=story.user)
    story.advance(timedelta(minutes=2))
    story.container.get(PeriodicChecks).run()
    story.expect_absent("check list", "passed", actor=story.user)
    story.expect_text("check start 1", "check 1 started: it runs again", actor=story.user)
    story.container.get(PeriodicChecks).run()
    story.expect_text("check list", "passed", "Suite", actor=story.user)


def test_an_agent_is_refused_when_it_starts_a_stopped_check(new_story):
    story = new_story(fixture=StoppedCheck)
    story.expect_refusal("check start 1 --reason needed", "A person was asked in the dock", actor=story.agent)
    story.expect_refusal("check run 1", "check 1 is stopped", actor=story.user)


def test_a_check_that_is_not_stopped_is_not_started(new_story):
    story = new_story(fixture=UserJoined)
    story.run('check make "Suite" --command "true" --every 0', actor=story.user)
    story.expect_refusal("check start 1", "check 1 is not stopped", actor=story.user)


def test_a_check_that_ended_has_no_percent_left_on_its_row(new_story):
    story = new_story(fixture=UserJoined)
    story.run('check make "Suite" --command "echo 1/4"', actor=story.user)
    story.run("check run 1", actor=story.user)
    expect_row(json.loads(story.run("check show 1 --json", actor=story.user).output_text), run_percent=None)


class SuiteCheck(StoryFixture):
    parent = UserJoined

    def steps(self, story):
        story.run('check make "Lint" --command "echo two problems; false" --every 0', actor=story.user)


class StoppedCheck(StoryFixture):
    parent = UserJoined

    def steps(self, story):
        story.run('check make "Suite" --command "true" --every 0', actor=story.user)
        story.run("check stop 1", actor=story.user)


def expect_output_runs_with(runs, expected) -> None:
    actual = runs[0]['output']
    assert expected in actual, actual


def expect_output_runs_with_2(runs, expected) -> None:
    actual = runs[1]['output']
    assert expected in actual, actual


def expect_passed_runs(runs, expected) -> None:
    actual = [run['passed'] for run in runs]
    assert actual == expected, actual


def test_a_running_check_offers_run_and_stop(new_story):
    story = new_story(fixture=UserJoined)
    story.run('check make "Suite" --command "true" --every 0', actor=story.user)
    story.expect_text("check show 1", "state: running", actor=story.user)
    buttons = {entry.declaration.name: entry.declaration for entry in story.container.get(Registry).buttons}
    story.expect_rows(buttons["checks.run"].condition.values == ("running",), buttons["checks.stop"].condition.values == ("running",), tuple(buttons["checks.run"].slots) == ("row.check",))


def test_a_stopped_check_offers_to_start_again(new_story):
    story = new_story(fixture=UserJoined)
    story.run('check make "Suite" --command "true" --every 0', actor=story.user)
    story.run("check stop 1", actor=story.user)
    story.expect_text("check show 1", "state: stopped", actor=story.user)
    buttons = {entry.declaration.name: entry.declaration for entry in story.container.get(Registry).buttons}
    story.expect_rows(buttons["checks.start"].condition.values == ("stopped",), buttons["checks.start"].label == "Start the check again")
