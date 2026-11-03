from core.base.command.bus import Bus
from core.base.driver.tool_type import ToolType
from core.modules.drivers.commands.bind_subagent_dispatch.bind_subagent_dispatch import BindSubagentDispatch
from core.testing.hook_samples import HookSample, HookSamples
from tests.stories.core.support.fixtures import UserJoined


def dispatch(**tool_input: str) -> HookSample:
    sample = HookSamples.sample("pre_tool_use", {"name": "Agent", "category": ToolType.AGENT, "files": [], "diff": None})
    return sample.with_raw({"tool_input": tool_input})


def finished(text: str) -> HookSample:
    sample = HookSamples.sample("post_tool_use", {"name": "Bash", "category": ToolType.UNCATEGORISED, "files": [], "diff": None})
    return sample.with_raw({"tool_response": {"stdout": text}})


def reader(prompt: str, profile: str = "Explore") -> HookSample:
    return dispatch(description="Read the cart", prompt=prompt, model="haiku", subagent_type=profile)


def ended_subagent_story(new_story, profile: str = "Explore"):
    story = new_story(fixture=UserJoined)
    tool_input = {"description": "Read the cart", "prompt": "Read src/cart.py and report", "model": "haiku", "subagent_type": profile}
    first = HookSamples.sample("pre_tool_use", {"name": "Agent", "category": ToolType.AGENT, "files": [], "diff": None}).with_raw({"tool_input": tool_input, "tool_use_id": "tool-1"})
    story.hook("s-1", first)
    subagent = story.new_row_id(f"agent start s-sub claude subagent --parent {story.agent.id} --environment main")
    story.container.get(Bus).run(BindSubagentDispatch(story.agent.id, profile, subagent), story.agent, environment_id=1)
    story.hook("s-1", first.with_fields(event="post_tool_use"))
    return story


def test_a_new_subagent_on_files_an_ended_one_read_is_refused_naming_it(new_story):
    story = ended_subagent_story(new_story)
    story.expect_hook_refusal("s-1", reader("Now check cart.py again"), "SendMessage to s-sub")


def test_a_new_subagent_on_other_files_goes_out(new_story):
    story = ended_subagent_story(new_story)
    story.expect_hook_allowed("s-1", reader("Read src/till.py and report"))


def test_a_new_subagent_of_another_profile_goes_out(new_story):
    story = ended_subagent_story(new_story)
    story.expect_hook_allowed("s-1", reader("Check src/cart.py", "researcher"))


def test_a_reviewer_judges_independently_and_goes_out(new_story):
    story = ended_subagent_story(new_story, "reviewer")
    story.expect_hook_allowed("s-1", reader("Review src/cart.py", "reviewer"))


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


def test_a_long_read_of_a_file_is_named_too(new_story):
    story = new_story(fixture=UserJoined)
    read = HookSamples.sample("post_tool_use", {"name": "Read", "category": "read", "files": ["a.py"], "diff": None})
    long = read.with_raw({"tool_response": {"type": "text", "file": {"filePath": "a.py", "content": "line\n" * 500}}})
    assert any("that result was 500 lines" in line for line in story.hook("s-1", long).lines)
    story.expect_absent_hook_line("s-1", read.with_raw({"tool_response": {"type": "text", "file": {"content": "line\n"}}}), "that result was")
