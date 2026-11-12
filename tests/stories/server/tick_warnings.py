from engine.database.points import Points
from engine.log.exception_sink import CLOCK_TICK_SOURCE
from engine.module.performance_tools import PerformanceTools
from engine.query.queries import Queries
from core.modules.chat.models.journal_exception import JournalException
from core.modules.processes.ticks.output_reading import OutputReading
from tests.stories.core.modules.developer.support.performance_fixture import DevelopmentToolsEnabled

TEST_ROWS_REASON = "the test reads every row it checks"


def test_tick_warnings_repeat_after_five_rise_at_once_and_reset_below_the_limit(new_story, monkeypatch):
    story = new_story(fixture=DevelopmentToolsEnabled)
    tools = story.container.get(PerformanceTools)
    costs = iter([51, 51, 51, 51, 51, 51, 52, 51, 51, 51, 51, 51, 52, 50, 51])
    monkeypatch.setattr(tools, "cost", lambda start: Points(rows=next(costs)))
    tick = OutputReading()
    counts = []
    for _ in range(15):
        tick(story.container)
        story.run_listeners()
        warnings = story.container.get(Queries).query(JournalException).filter(source=CLOCK_TICK_SOURCE).every_row(TEST_ROWS_REASON)
        counts.append(sum(1 for _ in warnings))
    story.expect_rows(counts == [1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 4, 5, 5, 6])
    marks = story.run("chat-mark main --environment main --json", actor=story.user).output_text
    lines = story.run(f"agent-line list --agent {story.agent.id}", actor=story.user).output_text
    story.expect_rows(marks.count("cost 51 points") == 4, all(f"journal-exception:{warning.id}" in lines for warning in warnings))
