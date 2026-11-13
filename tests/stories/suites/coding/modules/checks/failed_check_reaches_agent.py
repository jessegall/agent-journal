from datetime import timedelta
from pathlib import Path

from engine.testing.expectations.expect_reply import expect_absent_reply_line, expect_reply_line
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import UserBuilder
from suites.coding.modules.checks.support.check_nudges import CHECK_FAILED

FAILED = CHECK_FAILED.nudge(check=1).text


def failing_switch(story, tmp_path: Path) -> Path:
    switch = tmp_path / "failing"
    switch.write_text("first problem")
    story.run(f'check make "Lint" --command "cat {switch}" --every 0', actor=story.user)
    return switch


def read_lines(story) -> list[str]:
    return list(story.hook("s-1", HookSamples.prompt("go on")).lines)


def test_each_pass_to_fail_reaches_the_agent(new_story, tmp_path):
    story = new_story(fixture=UserBuilder)
    switch = failing_switch(story, tmp_path)
    for _ in range(2):
        switch.unlink()
        story.run("check run 1", actor=story.user)
        expect_lines(story, FAILED)
        expect_absent_lines(story, FAILED)
        switch.write_text("first problem")
        story.run("check run 1", actor=story.user)
        expect_absent_lines(story, FAILED)


def test_a_failure_reaches_an_agent_waiting_on_a_question(new_story, tmp_path):
    story = new_story(fixture=UserBuilder)
    switch = failing_switch(story, tmp_path)
    story.run('question ask "Which database?" --context "A story asks this so its card and answer can be checked." --options sqlite postgres --environment main', actor=story.agent)
    switch.unlink()
    story.run("check run 1", actor=story.user)
    expect_lines(story, FAILED)


def test_a_new_failure_with_no_pass_between_comes_again_only_after_an_hour(new_story, tmp_path):
    story = new_story(fixture=UserBuilder)
    switch = failing_switch(story, tmp_path)
    switch.unlink()
    story.run("check run 1", actor=story.user)
    expect_lines(story, FAILED)
    story.run("check run 1", actor=story.user)
    expect_absent_lines(story, FAILED)
    story.advance(timedelta(minutes=61))
    expect_lines(story, FAILED)


def expect_lines(story, expected) -> None:
    expect_reply_line(story.hook("s-1", HookSamples.prompt("go on")), expected)


def expect_absent_lines(story, expected) -> None:
    expect_absent_reply_line(story.hook("s-1", HookSamples.prompt("go on")), expected)
