from core.modules.chat.models.journal_exception import JournalException
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.ticks.output_reading import OutputReading
from engine.log.exception_sink import CLOCK_TICK_SOURCE
from tests.stories.core.modules.developer.support.performance_fixture import DevelopmentToolsEnabled
from tests.stories.core.modules.processes.support.process_samples import started_run

RUNNING_COUNT = 25
GROWN_COUNT = 20
TICK_LIMIT_POINTS = 50


def test_each_tick_after_the_first_with_twenty_five_quiet_runs_stays_under_fifty_points(new_story):
    story = new_story(fixture=DevelopmentToolsEnabled)
    for number in range(RUNNING_COUNT):
        started_run(story, f"make test-{number}")
    loading = OutputReading()
    loading(story.container)
    cost = story.tick_handler_points(loading)
    story.expected(cost is not None and cost.total < TICK_LIMIT_POINTS, f"the tick cost {cost.line() if cost is not None else 'nothing measured'}")


def test_a_tick_that_reads_twenty_grown_runs_is_within_its_limit_and_reports_no_slow_tick(new_story):
    story = new_story(fixture=DevelopmentToolsEnabled)
    runs = [started_run(story, f"make test-{number}") for number in range(GROWN_COUNT)]
    for run in runs:
        story.container.get(OutputFolder).write_output(run.id, 1, "line\n")
    OutputReading()(story.container)
    story.run_listeners()
    slow_ticks = [row for row in story.story_rows(JournalException) if row.source == CLOCK_TICK_SOURCE and "points" in row.message]
    story.expected(not slow_ticks, f"a slow tick was reported: {[row.message for row in slow_ticks]}")
