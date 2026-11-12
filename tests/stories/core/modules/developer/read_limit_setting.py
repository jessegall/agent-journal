from engine.actor.actor import Actor
from engine.cli.console import Console
from engine.cli.read_limit_bypass import ALLOW_LARGE_READ_FLAG
from engine.database.database import READ_LIMIT_ROWS, Database
from engine.database.request_watch import RequestWatch
from engine.database.statement import Statement
from engine.query.queries import Queries
from core.modules.chat.models.journal_exception import JournalException
from core.modules.developer.support.developer_settings import READ_LIMIT_SETTING, TOOLS_SETTING
from engine.testing.stories.story_fixture import StoryFixture
from engine.enums.actor_type import ActorType
from tests.stories.core.support.fixtures import UserJoined

LARGE_READ = Statement(f"WITH RECURSIVE numbers(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM numbers WHERE n <= {READ_LIMIT_ROWS}) SELECT n FROM numbers")
REFUSED = f"one read loaded {READ_LIMIT_ROWS + 1} rows, more than {READ_LIMIT_ROWS}"


class ReadLimitWithHelper(StoryFixture):
    """A main agent, a user and a helper of the main agent, before the read limit is switched on."""

    parent = UserJoined

    def steps(self, story):
        story.helper = Actor(story.new_row_id(f"agent start s-helper claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)


LINE = "task list"


def read_large(console, argv, caller, output):
    console.events.table.database.rows(LARGE_READ)
    return 0


def replace_parsed_run(story, monkeypatch):
    story.container.get(Database).read_limit_rows = READ_LIMIT_ROWS
    monkeypatch.setattr(Console, "run_parsed", read_large)


def recorded(story) -> list[str]:
    return [row.message for row in story.container.get(Queries).query(JournalException).limited(20) if "ReadLimitError" in row.message]


def test_a_line_of_the_main_agent_that_loads_too_many_rows_is_refused_and_shown_the_flag(new_story, monkeypatch):
    story = new_story(fixture=ReadLimitWithHelper)
    replace_parsed_run(story, monkeypatch)
    story.expect_refusal(LINE, REFUSED, actor=story.agent)
    story.expect_rows(ALLOW_LARGE_READ_FLAG in story.results[-1].output_text, len(recorded(story)) == 1)


def test_the_main_agent_runs_the_line_once_with_the_flag(new_story, monkeypatch):
    story = new_story(fixture=ReadLimitWithHelper)
    replace_parsed_run(story, monkeypatch)
    story.expect_success(f"{LINE} {ALLOW_LARGE_READ_FLAG}", actor=story.agent)
    story.expect_rows(recorded(story) == [])


def test_a_person_runs_the_line_with_the_flag(new_story, monkeypatch):
    story = new_story(fixture=ReadLimitWithHelper)
    replace_parsed_run(story, monkeypatch)
    story.expect_success(f"{LINE} {ALLOW_LARGE_READ_FLAG}", actor=story.user)


def test_a_helper_is_refused_without_the_flag_shown_and_the_error_is_recorded_for_the_main_agent(new_story, monkeypatch):
    story = new_story(fixture=ReadLimitWithHelper)
    replace_parsed_run(story, monkeypatch)
    story.expect_refusal(LINE, REFUSED, actor=story.helper)
    story.expect_rows(ALLOW_LARGE_READ_FLAG not in story.results[-1].output_text, len(recorded(story)) == 1)


def test_a_helper_that_passes_the_flag_is_refused(new_story, monkeypatch):
    story = new_story(fixture=ReadLimitWithHelper)
    replace_parsed_run(story, monkeypatch)
    story.expect_refusal(f"{LINE} {ALLOW_LARGE_READ_FLAG}", f"{ALLOW_LARGE_READ_FLAG} is for the main agent", actor=story.helper)


class ReadLimitEnabled(StoryFixture):
    """A user switched on the developer setting that refuses large loads."""

    parent = UserJoined

    def steps(self, story):
        story.expect_success(f"setting switch {TOOLS_SETTING} on --project", actor=story.user)
        story.expect_success(f"setting set {READ_LIMIT_SETTING} true --project", actor=story.user)


def test_a_hook_that_loads_too_many_rows_finishes_and_the_read_is_reported_once(new_story):
    story = new_story(fixture=ReadLimitEnabled)
    watch, database = story.container.get(RequestWatch), story.container.get(Database)
    for _ in range(2):
        with watch.watching_without_refusal(["hook", "claude"]):
            story.expect_rows(len(database.rows(LARGE_READ)) == READ_LIMIT_ROWS + 1)
    story.expect_rows(len(recorded(story)) == 1, database.collected_large_reads is None)


def test_a_line_of_a_caller_that_is_no_agent_finishes_and_the_read_is_reported(new_story, monkeypatch):
    story = new_story(fixture=ReadLimitEnabled)
    monkeypatch.setattr(Console, "run_parsed", read_large)
    with story.container.get(RequestWatch).watching(["process", "end"]):
        story.expect_success(LINE)
    story.expect_rows(len(recorded(story)) == 1)


def test_with_the_setting_off_a_large_read_passes(new_story, monkeypatch):
    story = new_story(fixture=UserJoined)
    monkeypatch.setattr(Console, "run_parsed", read_large)
    with story.container.get(RequestWatch).watching(["task", "list"]):
        story.expect_success(LINE, actor=story.agent)
    story.expect_rows(recorded(story) == [])
