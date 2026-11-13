from engine.module.module_finder import ModuleFinder
from engine.module.performance_tools import PerformanceTools
from core.modules.developer.support.slow_tick_tool import SlowTickTool
from core.modules.processes.ticks.output_reading import OutputReading
from server.tick.ticker import Ticker
from tests.stories.engine.driver.support.fixtures import LeadLocked
from tests.stories.engine.driver.support.samples import SAMPLES
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.fixtures import UserJoined
from core.modules.developer.support.developer_nudges import EXCEPTION_LINE
from engine.testing.expectations.expect_nudge import said
from core.modules.developer.support.developer_settings import EXCEPTION_LINES_SETTING
from core.modules.developer.support.developer_settings import SLOW_TICKS_SETTING


def test_the_agent_ticks_of_the_ticker_reach_each_open_agents_rules_and_a_silenced_history_rule_keeps_its_history(new_story):
    story = new_story(SAMPLES, fixture=LeadLocked)
    agent_ticks = next(handler for handler in Ticker.module_handlers(ModuleFinder(story.home)) if handler.label == "agent ticks")
    ticker = Ticker(story.home, [agent_ticks], lambda: None, lambda: 0.0)
    ticker.tick()
    ticker.join(5.0)
    story.expect_text(f"rule-history list --agent {story.agent.id}", "samples.return-line", "silenced")
    story.expect_absent(f"hook-call list --agent {story.agent.id}", "tick")


def test_the_handlers_the_modules_declare_start_at_their_own_pace(new_story):
    story = new_story(fixture=UserJoined)
    intervals = {handler.label: (handler.interval.seconds, handler.starts_immediately) for handler in Ticker.module_handlers(ModuleFinder(story.home))}
    expect_running_outputs_intervals(intervals, (1, False))
    expect_agent_ticks_intervals(intervals, (60, True))
    expect_hook_pruning_intervals(intervals, (60 * 60, False))
    expect_phone_notices_intervals(intervals, (60, True))


def test_a_slow_tick_shows_a_warning_mark_and_tells_the_main_agent_when_the_developer_options_are_on(new_story):
    story = new_story(fixture=UserBuilder)
    tools = story.container.get(PerformanceTools)
    tools.run(SlowTickTool, 51)
    story.run_listeners()
    story.expect_no_text("chat-mark main --environment main --json", "over its limit")
    story.expect_success("setting switch journal.core.developer.tools on --project", actor=story.user)
    story.expect_success(f"setting set {SLOW_TICKS_SETTING} true --project", actor=story.user)
    tools.run(SlowTickTool, 51)
    story.run_listeners()
    story.expect_text("chat-mark main --environment main --json", "A tick of the journal's clock cost 51 points", "tick costly")
    story.expect_no_text("message list --environment main", "over its limit")
    story.expect_text(f"agent-line list --agent {story.agent.id}", said(EXCEPTION_LINE))
    story.expect_text("journal-exception show 1", "source: clock tick", "cost 51 points", actor=story.agent)


def test_a_slow_tick_shows_no_mark_with_its_option_off_and_no_line_with_errors_to_the_agent_off(new_story):
    story = new_story(fixture=UserBuilder)
    tools = story.container.get(PerformanceTools)
    story.expect_success("setting switch journal.core.developer.tools on --project", actor=story.user)
    story.expect_success(f"setting set {SLOW_TICKS_SETTING} false --project", actor=story.user)
    tools.run(SlowTickTool, 52)
    story.run_listeners()
    story.expect_no_text("chat-mark main --environment main --json", "52 points")
    story.expect_success(f"setting set {SLOW_TICKS_SETTING} true --project", actor=story.user)
    story.expect_success(f"setting set {EXCEPTION_LINES_SETTING} false --project", actor=story.user)
    tools.run(SlowTickTool, 53)
    story.run_listeners()
    story.expect_text("chat-mark main --environment main --json", "53 points")
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "53 points")


def expect_phone_notices_intervals(intervals, expected) -> None:
    actual = intervals['phone notices']
    assert actual == expected, actual


def expect_hook_pruning_intervals(intervals, expected) -> None:
    actual = intervals['hook pruning']
    assert actual == expected, actual


def expect_agent_ticks_intervals(intervals, expected) -> None:
    actual = intervals['agent ticks']
    assert actual == expected, actual


def expect_running_outputs_intervals(intervals, expected) -> None:
    actual = intervals['read running outputs']
    assert actual == expected, actual
