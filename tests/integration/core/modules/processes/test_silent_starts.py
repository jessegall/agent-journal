from engine.testing.expectations.text_match import contains_line
from datetime import timedelta

from engine.enums.command_category import CommandCategory
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import ProcessQuery
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, started_run
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_value
from core.modules.processes.agent_messages.silent_start_fixed_message import SilentStartFixedMessage
from tests.integration.support.fixture_journal import FixtureJournal

ALIAS = "./build.sh"
ALIAS_START = HookSamples.shell(ALIAS, ShellPart("./build.sh", CommandCategory.BUILD, []))
GOLANG_TESTS = "go test ./..."
GOLANG_START = HookSamples.shell(GOLANG_TESTS, ShellPart("go", CommandCategory.TEST_RUN, ["test", "./..."]))
GOLANG_OUTPUT = "=== RUN   TestCart\n--- PASS: TestCart (30.00s)\n=== RUN   TestTotal\n--- PASS: TestTotal (40.00s)\nok  \tcart\t70.0s\n"
PERCENT_OUTPUT = "[1/4] compiling\n[2/4] compiling\n[3/4] compiling\n[4/4] compiling\n"
PROCESS_RULE = "processes.reading"
TRIED = "the build prints nothing a reader can count"
SKIP = f'refusal skip {PROCESS_RULE} --reason "the build prints nothing it can count" --environment main'


def silent_run(story: FixtureJournal, line: str, text: str = "", seconds: int = 70, category: CommandCategory = CommandCategory.BUILD) -> None:
    process = started_run(story, line, category)
    story.advance(timedelta(seconds=seconds))
    end_run(story, process, text)


def read_lines(story: FixtureJournal, sample) -> list[str]:
    return list(story.hook("s-1", sample).lines)


def expect_line(story: FixtureJournal, sample, text: str) -> None:
    lines = read_lines(story, sample)
    assert contains_line(lines, text), lines


def expect_line_absent(story: FixtureJournal, sample, text: str) -> None:
    lines = read_lines(story, sample)
    assert not any(text in line for line in lines), lines


class RunnerInstalled(StoryFixture):
    """The main agent runs its shell lines through an installed runner."""

    parent = BuilderStarted

    def steps(self, story: FixtureJournal) -> None:
        install_runner(story)


class BuildStarted(StoryFixture):
    """The saved build build-npm is running."""

    parent = RunnerInstalled

    def steps(self, story: FixtureJournal) -> None:
        started_run(story, ALIAS, CommandCategory.BUILD)


class FirstSilentBuild(StoryFixture):
    """The saved build build-npm ran 70 seconds and showed no percent."""

    parent = BuildStarted

    def steps(self, story: FixtureJournal) -> None:
        finish_build(story, 1, GOLANG_OUTPUT)


class SecondBuildStarted(StoryFixture):
    """The saved build build-npm runs a second time."""

    parent = FirstSilentBuild

    def steps(self, story: FixtureJournal) -> None:
        started_run(story, ALIAS, CommandCategory.BUILD)


def finish_build(story: FixtureJournal, process_id: int, text: str, seconds: int = 70) -> None:
    story.step("run started", process_id, ALIAS, [ALIAS])
    story.advance(timedelta(seconds=seconds))
    end_run(story, story.row(Process, process_id), text)
















def test_a_run_that_shows_a_percent_is_told_once_that_progress_shows(played):
    story = played(FirstSilentBuild)
    story.expect_success('reader add build-npm --commands "./build.sh*" --lines "compiling" --title "Building" --summary "compiling" --count "\\[[0-9]+/([0-9]+)\\]" --progress "\\[([0-9]+)/([0-9]+)\\]"', actor=story.agent)
    process = started_run(story, ALIAS, CommandCategory.BUILD)
    story.advance(timedelta(seconds=70))
    end_run(story, story.container.get(ProcessQuery).find(process.id), PERCENT_OUTPUT)
    expect_line(story, ALIAS_START, SilentStartFixedMessage.declared().agent_message(name='./build.sh').text)
    repeated = started_run(story, ALIAS, CommandCategory.BUILD)
    story.advance(timedelta(seconds=70))
    end_run(story, story.container.get(ProcessQuery).find(repeated.id), PERCENT_OUTPUT)
    expect_line_absent(story, ALIAS_START, "now shows its progress")
