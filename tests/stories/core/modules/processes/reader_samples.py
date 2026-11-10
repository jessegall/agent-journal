from engine.database.database import Database
from engine.driver.command_category import CommandCategory
from engine.scope.scopes import Scopes
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_absent_value, expect_total_cost_less

KEPT_RUNS = 30
READ_LIMIT_POINTS = 5
SECOND_ENVIRONMENT_ID = 99


def kept_runs(story) -> None:
    for number in range(KEPT_RUNS):
        end_run(story, start_process(story, f"make part-{number}", category=CommandCategory.BUILD), "built\n")


def test_a_sample_is_found_in_its_environment_only(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    kept_runs(story)
    parts = story.container.get(ProcessPartQuery)
    scopes = story.container.get(Scopes)
    with scopes.read_scope((), None, 1):
        story.expect_rows(parts.kept_samples(["make part-3*"]).page(1, 1).rows[0].text.startswith("make part-3"))
    with scopes.read_scope((), None, SECOND_ENVIRONMENT_ID):
        story.expect_rows(not parts.kept_samples(["make part-3*"]).page(1, 1).rows)


def test_a_command_with_no_sample_reads_no_part_row_into_python(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    kept_runs(story)
    database = story.container.get(Database)
    start = database.repeated_work.points()
    rows = story.container.get(ProcessPartQuery).kept_samples(["cargo test*"]).page(1, 1).rows
    cost = database.repeated_work.points().minus(start)
    expect_absent_value(rows)
    expect_total_cost_less(cost, READ_LIMIT_POINTS)
