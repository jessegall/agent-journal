import pytest

from engine.enums.command_category import CommandCategory
from engine.performance.performance_tool import PerformanceTool
from engine.module.performance_tools import PerformanceTools
from core.modules.developer.support.slow_tick_tool import SlowTickTool
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted


class SampleTool(PerformanceTool):
    """A tool a module has registered, or has not."""

    name = "sample.tool"

    def measure(self, *values: object) -> object:
        return "measured"


def read_tools(story) -> PerformanceTools:
    return story.container.get(PerformanceTools)


def test_a_test_run_keeps_the_file_until_it_ends(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = start_process(story, "pytest tests", category=CommandCategory.TEST_RUN)
    story.run_listeners()
    expect_exists_marker_tools(story)
    end_run(story, process, "1 passed\n")
    story.run_listeners()
    expect_absent_exists_marker_tools(story)


def test_a_run_that_is_no_test_writes_no_file(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    start_process(story, "make build", category=CommandCategory.BUILD)
    story.run_listeners()
    expect_absent_exists_marker_tools(story)


def test_a_lost_test_run_clears_the_file(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = start_process(story, "pytest tests", category=CommandCategory.TEST_RUN)
    story.run_listeners()
    story.expect_success(f"process orphan {process.id}", actor=story.agent)
    story.run_listeners()
    expect_absent_exists_marker_tools(story)


def test_every_registered_tool_stays_quiet_while_tests_run(new_story):
    story = new_story(fixture=BuilderStarted)
    tools = read_tools(story)
    tools.registered = {*tools.registered, SampleTool}
    expect_tools_3(tools, "measured")
    tools.keep_tests_running(True)
    expect_tools_2(tools, None)
    expect_tools(tools, 9.0, None)


def test_a_tool_no_module_registers_does_not_run(new_story):
    story = new_story(fixture=BuilderStarted)
    with pytest.raises(ValueError, match="registers the performance tool sample.tool"):
        read_tools(story).run(SampleTool)


def expect_tools(tools, number, expected) -> None:
    actual = tools.run(SlowTickTool, number)
    assert actual is expected, actual


def expect_tools_2(tools, expected) -> None:
    actual = tools.run(SampleTool)
    assert actual is expected, actual


def expect_tools_3(tools, expected) -> None:
    actual = tools.run(SampleTool)
    assert actual == expected, actual


def expect_absent_exists_marker_tools(story) -> None:
    actual = read_tools(story).marker.exists()
    assert not actual, actual


def expect_exists_marker_tools(story) -> None:
    actual = read_tools(story).marker.exists()
    assert actual, actual
