from core.modules.developer.support.developer_settings import PRIVATE_DATA_SETTING
import subprocess

from core.modules.developer.ticks.private_data_tick import PrivateDataTick
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_value

PLANTED = "contact " + "jane.doe" + "@" + "mail" + ".nl for access\n"


class ToolsEnabled(StoryFixture):
    """The developer tools are switched on for the project, so its private data scan runs."""

    parent = BuilderStarted

    def steps(self, story) -> None:
        story.expect_success("setting switch journal.core.developer.tools on --project", actor=story.agent)
        story.expect_success(f"setting set {PRIVATE_DATA_SETTING} true --project", actor=story.agent)


def planted_project(story, name: str = "notes.txt") -> None:
    folder = story.home.project_folder
    subprocess.run(["git", "-C", str(folder), "init", "-q"], check=True)
    (folder / name).write_text("first line\n" + PLANTED)
    (folder / "clean.txt").write_text("nothing private here\n")


def chat_marks(story) -> str:
    return story.run("chat-mark list --environment main", actor=story.agent).output_text


def test_a_planted_file_gets_one_card_naming_the_file_line_and_kind_and_never_the_text(new_story):
    story = new_story(fixture=ToolsEnabled)
    planted_project(story)
    PrivateDataTick()(story.container)
    story.run_listeners()
    marks = chat_marks(story)
    expect_value("notes.txt, line 2: an email address" in marks, True)
    expect_value(bool("clean.txt" not in marks and "jane" not in marks), True)


def test_a_file_already_scanned_is_not_scanned_again_until_it_changes(new_story):
    story = new_story(fixture=ToolsEnabled)
    planted_project(story, "again.txt")
    PrivateDataTick()(story.container)
    story.run_listeners()
    first = chat_marks(story).count("again.txt, line 2")
    PrivateDataTick()(story.container)
    story.run_listeners()
    expect_value(bool(first == 1 and chat_marks(story).count("again.txt, line 2") == 1), True)


def test_with_the_developer_tools_off_nothing_is_scanned(new_story):
    story = new_story(fixture=BuilderStarted)
    planted_project(story, "quiet.txt")
    PrivateDataTick()(story.container)
    story.run_listeners()
    expect_value("quiet.txt" not in chat_marks(story), True)
