from engine.database.actor_table import ActorTable
from engine.database.database import Database
from tests.integration.core.modules.usage.test_usage import HELPER_START
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder
from tests.stories.support.story_checks import expect_visited_limit

READ_STARTS = ("SELECT", "WITH")
READS_ALLOWED = 9


def read_selects(story, line: str) -> list[str]:
    story.container.get(ActorTable).row_owner(story.agent.id)
    connection = story.container.get(Database).connection
    statements: list[str] = []
    connection.set_trace_callback(statements.append)
    story.run(line, actor=story.agent)
    connection.set_trace_callback(None)
    return [statement for statement in statements if statement.lstrip().upper().startswith(READ_STARTS)]


def test_the_agents_window_reads_the_same_number_of_queries_for_one_agent_and_for_five(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    first_run = read_selects(story, "usage agents --environment main --json")
    for number in range(2, 6):
        story.run(HELPER_START.format(parent=story.agent.id).replace("s-2", f"s-{number + 1}"), actor=story.agent)
    five = read_selects(story, "usage agents --environment main --json")
    expect_visited_limit(five, len(first_run))
    expect_visited_limit(first_run, READS_ALLOWED)
