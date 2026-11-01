from core.base.driver.tool_type import ToolType
from core.testing.hook_samples import HookSample, HookSamples
from tests.stories.core.support.fixtures import UserJoined


def dispatch(**tool_input: str) -> HookSample:
    sample = HookSamples.sample("pre_tool_use", {"name": "Agent", "category": ToolType.AGENT, "files": [], "diff": None})
    return sample.with_fields(raw={"tool_input": tool_input})


def finished(text: str) -> HookSample:
    sample = HookSamples.sample("post_tool_use", {"name": "Bash", "category": ToolType.UNCATEGORISED, "files": [], "diff": None})
    return sample.with_fields(raw={"tool_response": {"stdout": text}})


def test_a_dispatch_with_no_model_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_hook_refusal("s-1", dispatch(description="Read the cart", prompt="Find where totals are counted"), "name a model")


def test_a_dispatch_with_no_job_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_hook_refusal("s-1", dispatch(model="haiku"), "no concrete job")
    story.expect_hook_refusal("s-1", dispatch(model="haiku", description="Read"), "no concrete job")


def test_a_bound_dispatch_with_a_model_goes_through_and_a_fork_needs_no_model(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_hook_allowed("s-1", dispatch(model="haiku", description="Read the cart", prompt="Find where totals are counted"))
    story.expect_hook_allowed("s-1", dispatch(subagent_type="fork", description="Read the cart", prompt="Find where totals are counted"))


def test_a_long_result_is_named_and_a_short_one_is_not(new_story):
    story = new_story(fixture=UserJoined)
    assert any("that result was 500 lines" in line for line in story.hook("s-1", finished("line\n" * 500)).lines)
    story.expect_absent_hook_line("s-1", finished("short\n"), "that result was")
