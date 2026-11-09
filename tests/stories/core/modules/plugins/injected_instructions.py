from core.base.journal_home import JournalHome
from core.testing.story_fixture import StoryFixture
from server.booting_work import BootingWork
from tests.stories.core.modules.plugins.support.plugin_samples import event_plugin_folder
from tests.stories.core.support.fixtures import MainEnvironment, UserJoined
from tests.stories.support.story_checks import expect_value

PLUGIN_TEXT = "Run the commandments before you hand in."
PROJECT_TEXT = "# Our project\n"
LAW = "The journal's law"
OLD_BLOCK = "<!-- BEGIN: agent-journal, form 4 (auto-generated, run `journal setup`) -->\nold laws\n<!-- END: agent-journal, form 4 -->\n"


def read_project(story):
    return story.container.get(JournalHome).project_folder


def journal_text(story):
    return (read_project(story) / "JOURNAL.md").read_text()


def plugin_with_text(story, name):
    folder = event_plugin_folder(story.home.folder.parent, [], {}, name=name, injected_instructions=["instructions/briefing.md"])
    (folder / "instructions").mkdir()
    (folder / "instructions" / "briefing.md").write_text(f"{PLUGIN_TEXT}\n")
    ran(story, f"plugin install {folder} --yes")


def ran(story, line):
    story.expect_success(line, actor=story.user)
    story.run_listeners()


def test_injected_instructions_are_written_on_enable(new_story):
    story = new_story(fixture=UserJoined)
    plugin_with_text(story, "enabled")
    ran(story, "plugin disable enabled")
    ran(story, "plugin enable enabled")
    text = journal_text(story)
    expect_value(bool(LAW in text and PLUGIN_TEXT in text), True)


def test_injected_instructions_are_removed_on_disable(new_story):
    story = new_story(fixture=UserJoined)
    plugin_with_text(story, "disabled")
    expect_value(PLUGIN_TEXT in journal_text(story), True)
    ran(story, "plugin disable disabled")
    text = journal_text(story)
    expect_value(bool(LAW in text and PLUGIN_TEXT not in text), True)


def test_injected_instructions_are_removed_when_deleted(new_story):
    story = new_story(fixture=UserJoined)
    plugin_with_text(story, "deleted")
    ran(story, "plugin disable deleted")
    ran(story, "plugin remove deleted")
    expect_value(PLUGIN_TEXT not in journal_text(story), True)


def test_injected_instructions_are_removed_when_deleted_without_disabling_first(new_story):
    story = new_story(fixture=UserJoined)
    plugin_with_text(story, "direct")
    expect_value(PLUGIN_TEXT in journal_text(story), True)
    ran(story, "plugin remove direct")
    expect_value(PLUGIN_TEXT not in journal_text(story), True)


def test_a_file_outside_the_plugin_is_not_taken_as_its_text(new_story):
    story = new_story(fixture=UserJoined)
    external = story.home.folder.parent / "outside.md"
    external.write_text("Text from outside the plugin.\n")
    folder = event_plugin_folder(story.home.folder.parent, [], {}, injected_instructions=["../outside.md"])
    story.expect_success(f"plugin install {folder} --yes", actor=story.user)
    story.run_listeners()
    expect_value("Text from outside" not in journal_text(story), True)


def booted(story):
    BootingWork().run(story.container)
    story.run_listeners()


class ListenersFinished(StoryFixture):
    parent = UserJoined

    def steps(self, story):
        story.run_listeners()


def test_each_official_file_gets_the_single_import_line_and_no_text(new_story):
    story = new_story(fixture=ListenersFinished)
    project = read_project(story)
    (project / "AGENTS.md").write_text(PROJECT_TEXT)
    (project / "CLAUDE.md").write_text(PROJECT_TEXT)
    booted(story)
    booted(story)
    for name in ("AGENTS.md", "CLAUDE.md"):
        expect_value((project / name).read_text(), f"{PROJECT_TEXT}\n@JOURNAL.md\n")
    expect_value(LAW in journal_text(story), True)


def test_a_file_that_imports_the_other_official_file_gets_no_second_import(new_story):
    story = new_story(fixture=ListenersFinished)
    project = read_project(story)
    (project / "AGENTS.md").write_text(PROJECT_TEXT)
    (project / "CLAUDE.md").write_text("@AGENTS.md\n")
    booted(story)
    expect_value((project / "CLAUDE.md").read_text(), "@AGENTS.md\n")
    expect_value((project / "AGENTS.md").read_text(), f"{PROJECT_TEXT}\n@JOURNAL.md\n")


def test_the_block_an_older_journal_wrote_into_an_official_file_goes(new_story):
    story = new_story(fixture=ListenersFinished)
    project = read_project(story)
    (project / "AGENTS.md").write_text(f"{PROJECT_TEXT}\n{OLD_BLOCK}\nOur own ending.\n")
    booted(story)
    expect_value((project / "AGENTS.md").read_text(), f"{PROJECT_TEXT}\nOur own ending.\n\n@JOURNAL.md\n")


def test_a_codex_agent_receives_the_text_through_its_launch_setting(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = story.home.folder.parent / "project"
    folder.mkdir()
    (folder / "JOURNAL.md").write_text('The "journal" text.\n')
    story.expect_text(f"program command codex {folder} --launch launch-1", '-c\ndeveloper_instructions="The \\"journal\\" text.\\n"')


def test_a_codex_agent_in_a_folder_without_the_file_has_no_launch_setting(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = story.home.folder.parent / "project"
    folder.mkdir()
    expect_value("developer_instructions" not in story.run(f"program command codex {folder} --launch launch-1").output_text, True)
