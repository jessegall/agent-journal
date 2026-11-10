from core.base.actor import Actor
from core.base.cli.console import Console
from core.base.cli.read_limit_bypass import ALLOW_LARGE_READ_FLAG
from core.base.database.database import READ_LIMIT_ROWS, Database
from core.base.database.statement import Statement
from core.base.query.queries import Queries
from core.modules.chat.models.journal_exception import JournalException
from core.testing.story_fixture import StoryFixture
from engine.enums.actor_type import ActorType
from tests.stories.core.support.fixtures import UserJoined

LARGE_READ = Statement(f"WITH RECURSIVE numbers(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM numbers WHERE n <= {READ_LIMIT_ROWS}) SELECT n FROM numbers")
REFUSED = f"one read loaded {READ_LIMIT_ROWS + 1} rows, more than {READ_LIMIT_ROWS}"


class ReadLimitWithHelper(StoryFixture):
    """A main agent, a person and a helper of the main agent, before the read limit is switched on."""

    parent = UserJoined

    def steps(self, story):
        story.helper = Actor(story.new_row_id(f"agent start s-helper claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)


LINE = "task list"


def replace_parsed_run(story, monkeypatch):
    story.container.get(Database).read_limit_rows = READ_LIMIT_ROWS

    def run_parsed(console, argv, caller, output):
        console.events.table.database.rows(LARGE_READ)
        return 0

    monkeypatch.setattr(Console, "run_parsed", run_parsed)


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
