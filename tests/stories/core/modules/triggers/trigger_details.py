import os
import select

from core.testing.hook_samples import HookSamples
from core.base.driver.command_category import CommandCategory
from core.modules.triggers.support.trigger_settings import AGENTS_ENABLE_SETTING
from core.modules.triggers.support.trigger_nudges import TRIGGER_DENIES, TRIGGER_LINE
from core.testing.shell_part import ShellPart
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderStarted

RUN_LIMIT_SECONDS = 5

GIT_CHAIN = HookSamples.shell("git status && git push --force", ShellPart("git", CommandCategory.VERSION_CONTROL, ["status"]), ShellPart("git", CommandCategory.VERSION_CONTROL, ["push", "--force"]))


class AgentsEnableTriggers(StoryFixture):
    """The builder started, and the setting lets an agent's trigger act at once."""

    parent = BuilderStarted

    def steps(self, story) -> None:
        story.run(f"setting set {AGENTS_ENABLE_SETTING} true --project")

    def expect(self, story) -> None:
        story.expect_text(f"setting show {AGENTS_ENABLE_SETTING}", "value: True")


def made(story, *edits: str):
    story.expect_success('trigger make "push --force" "Never force push" --do deny', actor=story.agent)
    for line in edits:
        story.expect_success(f"trigger edit 1 {line}", actor=story.agent)


class RunSignal:
    """A named pipe an extra command writes to, so a story waits on the command itself, never with a sleep."""

    def __init__(self, folder):
        self.path = folder / "ran"
        os.mkfifo(self.path)
        self.pipe = os.open(self.path, os.O_RDONLY | os.O_NONBLOCK)

    @property
    def command(self):
        return f"echo ran > {self.path}"

    def wait(self):
        readable, _, _ = select.select([self.pipe], [], [], RUN_LIMIT_SECONDS)
        os.close(self.pipe)
        assert readable, "the extra command did not run"


def extra_command_runner(story):
    binary = story.home.folder / "bin" / "journal-run"
    binary.parent.mkdir(parents=True, exist_ok=True)
    binary.write_text('#!/bin/sh\nfor line do :; done\nexec sh -c "$line"\n')
    binary.chmod(0o755)
    return story


def test_a_trigger_keeps_its_name_and_description(new_story):
    story = new_story(fixture=AgentsEnableTriggers)
    made(story, '--name "Never force push" --description "Blocks it"')
    story.expect_text("trigger list --json", '"name": "Never force push"', '"description": "Blocks it"', actor=story.agent)


def test_one_command_saves_a_new_trigger_with_all_its_details(new_story):
    story = new_story(fixture=AgentsEnableTriggers)
    story.expect_success("""trigger make --do deny --name "No force" --watch-places commands --match-mode word --conditions '[{"type": "agent", "value": "main"}]' -- "--force" "Never force push" """, actor=story.agent)
    story.expect_text("trigger list --json", '"name": "No force"', '"match_mode": "word"', actor=story.agent)
    story.expect_success("""trigger schedule --do instruct --name "Build check" --every 30 --times 2 -- "Look at the build" """, actor=story.agent)
    story.expect_text("trigger list --json", '"name": "Build check"', '"action": "instruct"', '"fire_limit": 2', actor=story.agent)


def test_a_new_trigger_with_a_wrong_condition_is_not_saved(new_story):
    story = new_story(fixture=AgentsEnableTriggers)
    story.expect_refusal("""trigger make --conditions '[{"type": "fired", "value": "often"}]' cart "Mind the cart" """, "cannot test 'often'", actor=story.agent)
    story.expect_text("trigger list --json", '{"rows": []}', actor=story.agent)


def test_a_trigger_looks_only_in_the_places_it_watches(new_story):
    story = new_story(fixture=AgentsEnableTriggers)
    made(story, "--watch-places messages")
    story.expect_hook_allowed("s-1", GIT_CHAIN)
    story.expect_success("trigger edit 1 --watch-places commands", actor=story.agent)
    story.expect_hook_refusal("s-1", GIT_CHAIN, TRIGGER_DENIES.nudge(trigger=1).text)


def test_whole_word_and_pattern_matching(new_story):
    story = new_story(fixture=AgentsEnableTriggers)
    made(story, '--phrases "pus" --match-mode word')
    story.expect_hook_allowed("s-1", GIT_CHAIN)
    story.expect_success('trigger edit 1 --phrases "git p.*force" --match-mode pattern', actor=story.agent)
    story.expect_hook_refusal("s-1", GIT_CHAIN, TRIGGER_DENIES.nudge(trigger=1).text)


def test_a_pattern_that_could_stall_a_hook_is_refused_when_saved(new_story):
    story = new_story(fixture=AgentsEnableTriggers)
    made(story)
    story.expect_refusal("""trigger edit 1 --phrases "(a+)+$" --match-mode pattern""", "may not repeat a repeat", actor=story.agent)
    story.expect_refusal(f"""trigger edit 1 --phrases "{'a' * 201}" --match-mode pattern""", "at most 200 characters", actor=story.agent)
    story.expect_success("""trigger edit 1 --phrases "(a+)+$" --match-mode part""", actor=story.agent)


def test_a_condition_that_does_not_pass_keeps_it_quiet(new_story):
    story = new_story(fixture=AgentsEnableTriggers)
    made(story, """--conditions '[{"type": "agent", "value": "helper"}]'""")
    story.expect_hook_allowed("s-1", GIT_CHAIN)
    story.expect_success("""trigger edit 1 --conditions '[{"type": "agent", "value": "main"}]'""", actor=story.agent)
    story.expect_hook_refusal("s-1", GIT_CHAIN, TRIGGER_DENIES.nudge(trigger=1).text)


def test_a_condition_on_the_hour_keeps_it_quiet_outside_the_hours(new_story):
    story = new_story(fixture=AgentsEnableTriggers)
    made(story, """--conditions '[{"type": "hours", "value": "0-0"}]'""")
    story.expect_hook_allowed("s-1", GIT_CHAIN)
    story.expect_success("""trigger edit 1 --conditions '[{"type": "hours", "value": "0-24"}]'""", actor=story.agent)
    story.expect_hook_refusal("s-1", GIT_CHAIN, TRIGGER_DENIES.nudge(trigger=1).text)


def test_a_condition_that_cannot_be_read_is_refused_when_saved(new_story):
    story = new_story(fixture=AgentsEnableTriggers)
    made(story)
    story.expect_refusal("""trigger edit 1 --conditions '[{"type": "fired", "value": "often"}]'""", "cannot test 'often'", actor=story.agent)
    story.expect_refusal("""trigger edit 1 --extra-actions '[{"type": "web", "target": ""}]'""", "needs a command line or a web address", actor=story.agent)
    story.expect_refusal("""trigger edit 1 --conditions '[{"type": "moon", "value": "full"}]'""", "cannot be read", actor=story.agent)


def test_a_paused_trigger_rests_and_goes_on_again(new_story):
    story = new_story(fixture=AgentsEnableTriggers)
    made(story)
    story.expect_success("trigger pause 1", "trigger 1 paused", actor=story.agent)
    story.expect_text("trigger list --json", '"text": "Never force push"', '"paused_at": "', actor=story.agent)
    story.expect_hook_allowed("s-1", GIT_CHAIN)
    story.expect_success("trigger pause 1 --off", "trigger 1 goes on", actor=story.agent)
    story.expect_hook_refusal("s-1", GIT_CHAIN, TRIGGER_DENIES.nudge(trigger=1).text)


def test_a_fired_trigger_runs_its_extra_command(new_story, tmp_path):
    story = extra_command_runner(new_story(fixture=AgentsEnableTriggers))
    marker = RunSignal(tmp_path)
    story.expect_success('trigger make "cart" "Mind the cart"', actor=story.agent)
    story.expect_success(f"""trigger edit 1 --extra-actions '[{{"type": "run", "target": "{marker.command}"}}]'""", actor=story.agent)
    story.hook("s-1", HookSamples.prompt("Fix the cart"))
    story.run_listeners()
    story.expect_text("trigger list --json", '"fired_count": 1', actor=story.agent)
    marker.wait()


def test_a_trigger_that_blocks_counts_as_fired_and_runs_its_extra_command(new_story, tmp_path):
    story = extra_command_runner(new_story(fixture=AgentsEnableTriggers))
    marker = RunSignal(tmp_path)
    made(story, f"""--extra-actions '[{{"type": "run", "target": "{marker.command}"}}]'""")
    story.expect_hook_refusal("s-1", GIT_CHAIN, TRIGGER_DENIES.nudge(trigger=1).text)
    story.run_listeners()
    story.expect_text("trigger list --json", '"fired_count": 1', actor=story.agent)
    marker.wait()


def test_a_trigger_ends_at_its_limit_of_firings(new_story):
    story = new_story(fixture=AgentsEnableTriggers)
    story.expect_success('trigger make "cart" "Mind the cart"', actor=story.agent)
    story.expect_success("trigger edit 1 --fire-limit 1", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.prompt("Fix the cart"), TRIGGER_LINE.nudge(trigger=1).text)
    story.expect_absent_hook_line("s-1", HookSamples.prompt("Fix the cart again"), TRIGGER_LINE.nudge(trigger=1).text)
    story.expect_text("trigger list --json", '{"rows": []}', actor=story.agent)


def test_a_scheduled_trigger_runs_its_extra_command_when_its_time_comes(new_story, tmp_path):
    story = extra_command_runner(new_story(fixture=AgentsEnableTriggers))
    marker = RunSignal(tmp_path)
    story.expect_success('trigger schedule "Look at the build" --at 2020-01-01T00:00:00+00:00', actor=story.agent)
    story.expect_success(f"""trigger edit 1 --extra-actions '[{{"type": "run", "target": "{marker.command}"}}]'""", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.prompt("Next"), TRIGGER_LINE.nudge(trigger=1).text)
    story.expect_absent_hook_line("s-1", HookSamples.prompt("Next"), TRIGGER_LINE.nudge(trigger=1).text)
    story.run_listeners()
    marker.wait()
