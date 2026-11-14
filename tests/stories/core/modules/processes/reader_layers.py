import json

from engine.enums.command_category import CommandCategory
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.plugins.support.plugin_samples import MANIFEST, sample_plugin_folder
from tests.stories.core.modules.processes.reading_pins_asks import PYTEST_SAMPLE, ProjectPytestReader
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run, install_runner
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, worker_run
from tests.stories.core.support.coding_fixtures import BuilderStarted, UserBuilder

BUILD_OUTPUT = "project line\nplugin line\nmake: all done\n"
NOX_OUTPUT = "FAILED one\nerror two\n"
TOX_OUTPUT = "ok first\nFAILED second\nok third\nFAILED fourth\n"
UNRECOGNIZED_TEST_OUTPUT = "starting\n" * 10 + "3/3\nTests: 3 passed\n"


def republish_stock_readers(story: Story) -> None:
    story.synced()
    story.run_listeners()


def read_lines(story: Story, line: str, text: str) -> str:
    process = ended_run(story, line, text)
    return story.run(f"output read {process.id} --summary", actor=story.agent).output_text


class ProjectMakeReader(StoryFixture):
    """A project reader reads make lines that start with project."""

    parent = UserBuilder

    def steps(self, story: Story) -> None:
        story.run('reader add project-make --commands "make *" --lines "^project"', actor=story.agent)


class PluginMakeReader(StoryFixture):
    """After the project reader, a plugin installed a reader of make lines that start with plugin."""

    parent = ProjectMakeReader

    def steps(self, story: Story) -> None:
        folder = sample_plugin_folder(story.home.folder.parent)
        readers = folder / ".journal-plugin" / "readers"
        readers.mkdir(parents=True)
        (readers / "plugin-make.pattern").write_text("title: Plugin make\n^plugin\ncommands: make *\n")
        (folder / "journal-plugin.json").write_text(json.dumps(MANIFEST))
        story.run(f"plugin install {folder} --yes", actor=story.user)


class CustomTestRequest(StoryFixture):
    """A worker's custom test run printed a pytest output and waits for a reader."""

    parent = ForcedReaders

    def steps(self, story: Story) -> None:
        install_runner(story)
        end_run(story, worker_run(story, "custom-test run", CommandCategory.TEST_RUN), PYTEST_SAMPLE)


def test_a_script_reader_and_a_pattern_reader_pick_the_same_lines_of_one_output(new_story):
    story = new_story(fixture=BuilderStarted)
    script = story.home.folder / "read_failures.sh"
    script.write_text("#!/bin/sh\ngrep FAILED\n")
    script.chmod(0o755)
    story.run(f'reader add failures-script --commands "nox*" --script {script}', actor=story.agent)
    story.run('reader add failures-pattern --commands "tox*" --lines "FAILED"', actor=story.agent)
    for line in ("nox -s py", "tox -e py"):
        lines = read_lines(story, line, TOX_OUTPUT)
        story.expect_rows("FAILED second" in lines, "FAILED fourth" in lines, "ok third" not in lines, detail=lines)


def test_a_draft_is_only_text_until_the_agent_saves_it(new_story):
    story = new_story(fixture=CustomTestRequest)
    end_run(story, worker_run(story, "other-test run", CommandCategory.TEST_RUN), UNRECOGNIZED_TEST_OUTPUT)
    story.expect_text("reader draft 2", "other-test-reader", actor=story.agent)
    story.expect_absent("reader list", "other-test-reader", actor=story.agent)
    story.expect_text("reader draft 2 --save", "saved reader other-test-reader", actor=story.agent)
    story.expect_text("reader list", "other-test-reader", actor=story.agent)


def test_a_project_reader_reads_before_a_stock_reader_published_after_it(new_story):
    story = new_story(fixture=ProjectMakeReader)
    older_stock_read = read_lines(story, "make all", BUILD_OUTPUT)
    story.run("reader remove make")
    republish_stock_readers(story)
    newer_stock_read = read_lines(story, "make all", BUILD_OUTPUT)
    story.expect_rows("project line" in older_stock_read, "project line" in newer_stock_read, "plugin line" not in newer_stock_read,
                      detail=f"{older_stock_read}\n{newer_stock_read}")


def test_a_plugin_reader_reads_after_a_project_reader_and_before_a_newer_stock_reader(new_story):
    story = new_story(fixture=PluginMakeReader)
    story.run("reader remove make")
    republish_stock_readers(story)
    project_read = read_lines(story, "make all", BUILD_OUTPUT)
    story.run("reader remove project-make", actor=story.agent)
    plugin_read = read_lines(story, "make all", BUILD_OUTPUT)
    story.expect_rows("project line" in project_read, "plugin line" not in project_read,
                      "plugin line" in plugin_read, "project line" not in plugin_read, detail=f"{project_read}\n{plugin_read}")


def test_of_two_project_readers_the_default_reads_and_else_the_newest(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('reader add nox-failures --commands "nox*" --lines "FAILED"', actor=story.agent)
    story.run('reader add nox-errors --commands "nox*" --lines "error"', actor=story.agent)
    newest_read = read_lines(story, "nox -s py", NOX_OUTPUT)
    story.run("reader default nox-failures", actor=story.agent)
    default_read = read_lines(story, "nox -s py", NOX_OUTPUT)
    story.expect_rows("error two" in newest_read, "FAILED one" not in newest_read,
                      "FAILED one" in default_read, "error two" not in default_read, detail=f"{newest_read}\n{default_read}")


def test_selection_and_drafting_both_put_a_project_reader_before_a_newer_stock_reader(new_story):
    story = new_story(fixture=ProjectPytestReader)
    end_run(story, worker_run(story, "pytest tests/cart -q", CommandCategory.TEST_RUN), PYTEST_SAMPLE)
    republish_stock_readers(story)
    story.expect_text("reader draft 1", "journal reader add project-tests", actor=story.agent)
    story.expect_text(f"output show {ended_run(story, 'pytest tests/cart -q', PYTEST_SAMPLE).id}", "Project tests", actor=story.agent)


def test_a_draft_tries_a_stock_reader_as_it_was_edited(new_story):
    story = new_story(fixture=CustomTestRequest)
    story.run('reader add pytest --title "Edited tests"', actor=story.agent)
    story.expect_text("reader draft 1", "journal reader add pytest", "Edited tests", actor=story.agent)
