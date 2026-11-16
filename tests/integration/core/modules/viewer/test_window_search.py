from tests.stories.support.story_checks import expect_value
from engine.registry.registry import Registry
from engine.testing.expectations.expect_row import expect_row
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderStarted

SEARCH = "window search questions.questions"


class DatabaseQuestions(StoryFixture):
    parent = BuilderStarted

    def steps(self, story):
        story.run('question ask "Which database?" --context "A story asks this so its card and answer can be checked." --environment main', actor=story.agent)
        story.run('question ask "Which cache?" --context "A story asks this so its card and answer can be checked." --environment main', actor=story.agent)


def expect_fields_search(search, expected) -> None:
    actual = search['fields']
    assert actual == expected, actual


def expect_reads_windows_with(windows, name, expected) -> None:
    actual = windows[name].reads
    assert expected in actual, actual


def test_the_declaration_lists_what_the_viewer_draws_without_the_function(journal):
    window = next(window for window in Registry.read(journal.database).windows if window.name == "questions.questions")
    expect_row(window.search, placeholder="Search the questions")
    expect_row(window.search, context=[])
    expect_row(window.search, button={})


def test_searches_over_read_commands_declare_the_command_placeholder_and_matching_fields(journal):
    windows = {window.name: window for window in Registry.read(journal.database).windows}
    searches = {
        "settings.settings": ("setting tree", "Find a setting", ["title", "description", "key"]),
        "profiles.profiles": ("profile list", "Find a profile", ["name", "description", "agent_type", "model", "codex_model"]),
        "search.search": ("search find", "Search the journal", []),
        "skills.skills": ("skill list", "Find a skill", ["folder", "description"]),
        "messages.attachments": ("attachment list", "Search file names and their messages", ["name", "message_text"]),
        "coding.files": ("project-file find", "Find a file in the project", []),
    }
    for name, (read, placeholder, fields) in searches.items():
        search = windows[name].search
        expect_row(search, read=read)
        expect_row(search, placeholder=placeholder)
        expect_value(search['fields'], fields)
        expect_reads_windows_with(windows, name, read)


def test_worker_and_helper_windows_declare_the_same_agent_search(journal):
    windows = {window.name: window for window in Registry.read(journal.database).windows}
    expect_row(windows["agents.agents"], search=windows["agents.helpers"].search)
