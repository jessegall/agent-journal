from core.base.driver.tool_type import ToolType
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.support.fixtures import UserJoined

TODO_LIST_HOOK = HookSamples.sample("post_tool_use", {"name": "TodoWrite", "category": ToolType.UNCATEGORISED, "files": [], "diff": None}).with_fields(
    raw={"tool_name": "TodoWrite", "tool_input": {"todos": [{"content": "Add the tax", "status": "completed"},
                                                             {"content": "Round to cents", "status": "in_progress"}]}})


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(fixture=UserJoined))


def test_the_points_window_is_a_page_window_of_one_agent_that_reads_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_declared_window("workers.points", "component", "agent")
    window.expect_window_allowed("workers.points", "worker-worktree list --agent 2")
    window.expect_window_allowed("workers.points", "task show 1")
    window.expect_window_allowed("workers.points", "proof list --worktree 1")


def test_the_todos_window_is_a_page_window_of_one_agent_that_reads_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_declared_window("workers.todos", "component", "agent")
    window.expect_window_allowed("workers.todos", "todo-item list --agent 2 --oldest")


def test_a_to_do_list_the_agent_program_writes_is_kept_in_place_of_the_last(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", TODO_LIST_HOOK)
    story.hook("s-1", TODO_LIST_HOOK)
    story.expect_rows(story.run(f"todo-item list --agent {story.agent.id}").output_text.count("Add the tax") == 1)
    story.expect_text(f"todo-item list --agent {story.agent.id} --oldest", "Add the tax", "completed", "Round to cents", "in_progress")
