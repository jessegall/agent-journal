from core.modules.processes.ticks.output_reading import OutputReading
from tests.stories.core.modules.developer.support.performance_fixture import DevelopmentToolsEnabled
from tests.stories.core.modules.processes.support.process_samples import started_run

RUNNING_COUNT = 25
TICK_LIMIT_POINTS = 50


def test_each_tick_after_the_first_with_twenty_five_quiet_runs_stays_under_fifty_points(new_story):
    story = new_story(fixture=DevelopmentToolsEnabled)
    for number in range(RUNNING_COUNT):
        started_run(story, f"make test-{number}")
    reading = OutputReading()
    reading(story.container)
    cost = story.tick_handler_points(reading)
    story.expected(cost is not None and cost.total < TICK_LIMIT_POINTS, f"the tick cost {cost.line() if cost is not None else 'nothing measured'}")
