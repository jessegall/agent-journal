from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, started_run
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_value

ALIAS = "journal build-npm --tail 5"
ALIAS_START = HookSamples.shell(ALIAS, ShellPart("journal", CommandCategory.BUILD, ["build-npm", "--tail", "5"]))
GOLANG_TESTS = "go test ./..."
GOLANG_START = HookSamples.shell(GOLANG_TESTS, ShellPart("go", CommandCategory.TEST_RUN, ["test", "./..."]))
GOLANG_OUTPUT = "=== RUN   TestCart\n--- PASS: TestCart (30.00s)\n=== RUN   TestTotal\n--- PASS: TestTotal (40.00s)\nok  \tcart\t70.0s\n"
PERCENT_OUTPUT = "[1/4] compiling\n[2/4] compiling\n[3/4] compiling\n[4/4] compiling\n"
PROCESS_RULE = "processes.silent-start"
TRIED = "the build prints nothing a reader can count"
SKIP = f'refusal skip {PROCESS_RULE} --reason "the build prints nothing it can count" --environment main'


def silent_run(story: Story, line: str, text: str = "", seconds: int = 70, category: CommandCategory = CommandCategory.BUILD) -> None:
    process = started_run(story, line, category)
    story.advance(timedelta(seconds=seconds))
    end_run(story, process, text)


def read_lines(story: Story, sample) -> list[str]:
    return list(story.hook("s-1", sample).lines)


def expect_line(story: Story, sample, text: str) -> None:
    lines = read_lines(story, sample)
    assert any(text in line for line in lines), lines


def expect_no_line(story: Story, sample, text: str) -> None:
    lines = read_lines(story, sample)
    assert not any(text in line for line in lines), lines


class RunnerInstalled(StoryFixture):
    """The main agent runs its shell lines through an installed runner."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        install_runner(story)


class BuildStarted(StoryFixture):
    """The saved build build-npm is running."""

    parent = RunnerInstalled

    def steps(self, story: Story) -> None:
        started_run(story, ALIAS, CommandCategory.BUILD)


class FirstSilentBuild(StoryFixture):
    """The saved build build-npm ran 70 seconds and showed no percent."""

    parent = BuildStarted

    def steps(self, story: Story) -> None:
        finish_build(story, 1, GOLANG_OUTPUT)


class SecondBuildStarted(StoryFixture):
    """The saved build build-npm runs a second time."""

    parent = FirstSilentBuild

    def steps(self, story: Story) -> None:
        started_run(story, ALIAS, CommandCategory.BUILD)


def finish_build(story: Story, process_id: int, text: str, seconds: int = 70) -> None:
    story.container.get(OutputFolder).write_start(process_id, ALIAS, [ALIAS])
    story.advance(timedelta(seconds=seconds))
    end_run(story, story.row(Process, process_id), text)


def test_the_first_silent_run_is_taught_at_the_next_start_with_the_shape_found(new_story):
    story = new_story(fixture=BuildStarted)
    finish_build(story, 1, GOLANG_OUTPUT)
    lines = read_lines(story, ALIAS_START)
    for text in ("journal build-npm ran 70 seconds and showed no percent in the chat", "line shape --- PASS:/--- FAIL:", "states no total, so the command must print one first", "never wait for the run to end"):
        expect_value(bool(any(text in line for line in lines)), True)


def test_a_shape_that_states_a_total_says_so(new_story):
    story = new_story(fixture=BuildStarted)
    finish_build(story, 1, "reading 1/9\nreading 2/9\n", seconds=75)
    expect_line(story, ALIAS_START, "line shape reading n/m, and it states its total")


def test_a_second_silent_run_refuses_the_next_start_with_a_ready_reader(new_story):
    story = new_story(fixture=SecondBuildStarted)
    finish_build(story, 2, GOLANG_OUTPUT, seconds=71)
    reply = story.hook("s-1", ALIAS_START)
    expect_value("journal build-npm ran silent twice" in reply.refusal, True)
    ready = [line for line in reply.lines if "a reader for journal build-npm" in line]
    expect_value(bool(ready and 'journal reader add build-npm --commands "journal build-npm --tail 5"' in ready[0] and '--step "(?m)^\\s*--- (?:(?P<passed>PASS)|(?P<failed>FAIL)):"' in ready[0]), True)


def test_a_skip_with_a_reason_lets_the_refused_start_through_once(new_story):
    story = new_story(fixture=SecondBuildStarted)
    finish_build(story, 2, GOLANG_OUTPUT, seconds=72)
    story.expect_hook_refusal("s-1", ALIAS_START, "ran silent twice")
    story.advance(timedelta(seconds=1))
    story.expect_text(SKIP, "held", actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_hook_refusal("s-1", ALIAS_START, "ran silent twice")
    story.expect_success(f'refusal confirm 1 --tried "{TRIED}" --environment main', actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_hook_allowed("s-1", ALIAS_START)


def test_a_reader_made_since_the_second_silent_run_lifts_the_refusal(new_story):
    story = new_story(fixture=SecondBuildStarted)
    finish_build(story, 2, GOLANG_OUTPUT, seconds=73)
    story.expect_hook_refusal("s-1", ALIAS_START, "ran silent twice")
    story.expect_success('reader add build-npm --commands "journal build-npm*" --lines "PASS" --progress "\\[([0-9]+)/([0-9]+)\\]"', actor=story.agent)
    story.expect_hook_allowed("s-1", ALIAS_START)


def test_a_redirected_run_with_no_output_counts_silent(new_story):
    story = new_story(fixture=RunnerInstalled)
    silent_run(story, GOLANG_TESTS, "", category=CommandCategory.TEST_RUN)
    lines = read_lines(story, GOLANG_START)
    for text in ("go test ./... ran 70 seconds and showed no percent in the chat", "line shape none of the known ones"):
        expect_value(bool(any(text in line for line in lines)), True)


def test_a_run_that_printed_lines_with_no_percent_counts_silent(new_story):
    story = new_story(fixture=BuildStarted)
    finish_build(story, 1, "compiling\ncompiling\n", seconds=76)
    expect_line(story, ALIAS_START, "journal build-npm ran 76 seconds and showed no percent")


def test_a_short_run_is_never_silent(new_story):
    story = new_story(fixture=BuildStarted)
    finish_build(story, 1, GOLANG_OUTPUT, seconds=50)
    expect_no_line(story, ALIAS_START, "showed no percent")


def test_a_run_that_shows_a_percent_is_told_once_that_progress_shows(new_story):
    story = new_story(fixture=FirstSilentBuild)
    story.expect_success('reader add build-npm --commands "journal build-npm*" --lines "compiling" --title "Building" --summary "compiling" --count "\\[[0-9]+/([0-9]+)\\]" --progress "\\[([0-9]+)/([0-9]+)\\]"', actor=story.agent)
    process = started_run(story, ALIAS, CommandCategory.BUILD)
    story.advance(timedelta(seconds=70))
    end_run(story, story.container.get(ProcessQuery).find(process.id), PERCENT_OUTPUT)
    expect_line(story, ALIAS_START, "journal build-npm now shows its progress in the chat")
    again = started_run(story, ALIAS, CommandCategory.BUILD)
    story.advance(timedelta(seconds=70))
    end_run(story, story.container.get(ProcessQuery).find(again.id), PERCENT_OUTPUT)
    expect_no_line(story, ALIAS_START, "now shows its progress")
