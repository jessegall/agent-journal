import os

from core.base.driver.command_category import CommandCategory
from core.base.exception_sink import CLOCK_TICK_SOURCE
from core.base.query.queries import Queries
from core.modules.chat.models.journal_exception import JournalException
from core.base.module.performance_tools import PerformanceTools
from core.base.timing import Timing
from core.modules.drivers.support.hook_cost_tool import HOOK_LIMIT_POINTS
from core.modules.developer.support.slow_tick_tool import SlowTickTool
from install.code_replacement import CodeReplacement
from server.booting_work import BootingWork
from server.server_files import ServerFiles
from core.base.performance.performance_state import PerformanceState
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.modules.developer.support.performance_fixture import DevelopmentToolsEnabled


def developer_story(new_story):
    return new_story(fixture=DevelopmentToolsEnabled)


def warning_count(story):
    story.run_listeners()
    rows = story.container.get(Queries).query(JournalException).all_rows()
    return len([row for row in rows if row.source == CLOCK_TICK_SOURCE and "points" in row.message])


def warn_after_ready(story):
    tools = story.container.get(PerformanceTools)
    count = warning_count(story)
    points = HOOK_LIMIT_POINTS + 1 + count
    story.expect_rows(tools.run(SlowTickTool, points) is True)
    story.expect_rows(warning_count(story) == count + 1)
    story.expect_text("chat-mark main --environment main --json", f"{points} points", actor=story.user)


def check_startup_measurements(story):
    tools = story.container.get(PerformanceTools)
    count = warning_count(story)
    BootingWork().run(story.container)
    story.expect_rows(tools.begin() is None, tools.run(SlowTickTool, HOOK_LIMIT_POINTS + 1) is None, warning_count(story) == count)
    story.run_listeners()
    warn_after_ready(story)


def check_restart_measurements(story):
    tools = story.container.get(PerformanceTools)
    count = warning_count(story)
    story.home.restart_mark.write_text(str(os.getpid()))
    story.expect_rows(tools.run(SlowTickTool, HOOK_LIMIT_POINTS + 1) is None, warning_count(story) == count)
    story.home.restart_mark.unlink()
    warn_after_ready(story)


def check_replacement_measurements(story):
    tools = story.container.get(PerformanceTools)
    measurements = []
    count = warning_count(story)
    CodeReplacement(story.home).run([lambda: measurements.append(tools.run(SlowTickTool, HOOK_LIMIT_POINTS + 1))])
    story.expect_rows(measurements == [None], warning_count(story) == count)
    BootingWork().run(story.container)
    ServerFiles(story.home).clear_restart()
    story.run_listeners()
    warn_after_ready(story)


def test_performance_stays_quiet_through_start_restart_install_reload_and_tests_then_reports_points(new_story):
    story = install_runner(developer_story(new_story))
    check_startup_measurements(story)
    check_restart_measurements(story)
    check_replacement_measurements(story)
    tools = story.container.get(PerformanceTools)
    state = story.container.get(PerformanceState)
    with state.reload():
        story.expect_rows(tools.begin() is None, tools.run(SlowTickTool, HOOK_LIMIT_POINTS + 1) is None)
        timing = Timing.parsed("go_start=123").joined(Timing.started("server_accepted", state))
        timing.stamp("server_received")
        story.expect_rows(timing.stamps == [("go_start", 123)], timing.request_id(42) == "42-123")
    warn_after_ready(story)
    count = warning_count(story)
    process = start_process(story, "pytest tests/cart.py", category=CommandCategory.TEST_RUN)
    story.run_listeners()
    story.expect_rows(tools.run(SlowTickTool, HOOK_LIMIT_POINTS + 1) is None, warning_count(story) == count)
    end_run(story, process, "1 passed\n")
    story.run_listeners()
    warn_after_ready(story)
