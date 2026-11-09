from core.testing.story_overlap import StoryOverlap
from core.testing.hook_samples import HookSamples
from core.testing.story_path import StoryPath
from core.base.driver.hook_reply import HookReply

FIRST = "a.py::test_first"
SECOND = "b.py::test_second"
THIRD = "c.py::test_third"


def overlap_of(stories: dict[str, tuple[str, list[str]]]) -> list[str]:
    overlap = StoryOverlap()
    for test_id, (start, lines) in stories.items():
        overlap.add(test_id, start, lines, lines)
    return overlap.report_lines()


def command(line: str) -> str:
    return f"command 1 1: {line}"


def test_two_stories_in_different_files_that_share_most_steps_are_named():
    lines = [command("task list"), command("plan list"), command("task show"), command("plan show")]
    report = overlap_of({FIRST: ("Started", [*lines, command("doc list")]), SECOND: ("Started", [*lines, command("doc show")]), THIRD: ("Started", [command("agent list")])})
    assert any("share" in line and FIRST in line and SECOND in line for line in report), report
    assert not any(THIRD in line for line in report), report


def test_stories_that_share_no_more_than_the_limit_are_not_named_as_overlapping():
    first = ["one", "two", "three", "four"]
    second = ["one", "five", "six", "seven"]
    report = overlap_of({FIRST: ("Started", first), SECOND: ("Started", second)})
    assert not any("% of their steps" in line for line in report), report


def test_the_same_steps_from_another_start_do_not_overlap():
    lines = [command("task list"), command("plan list"), command("doc list")]
    assert overlap_of({FIRST: ("Started", lines), SECOND: ("Joined", lines)}) == []


def test_the_same_command_by_another_actor_is_another_step():
    lines = ["task list", "plan list", "doc list"]
    assert overlap_of({FIRST: ("Started", [f"command 1 1: {line}" for line in lines]), SECOND: ("Started", [f"command 2 1: {line}" for line in lines])}) == []


def test_the_cases_of_one_story_are_not_compared_with_each_other():
    lines = [command("task list"), command("plan list"), command("doc list")]
    assert overlap_of({f"{FIRST}[one]": ("Started", lines), f"{FIRST}[two]": ("Started", lines)}) == []


def test_a_story_inside_a_longer_story_reaches_nothing_new():
    shared = [command("task list"), command("plan list")]
    report = overlap_of({FIRST: ("Started", shared), SECOND: ("Started", [*shared, command("doc list"), command("doc show"), command("agent list"), command("agent show")])})
    assert f"story reaches nothing the other stories do not: {FIRST}" in report, report


def test_of_two_stories_that_cover_each_other_only_one_is_named_as_reaching_nothing_new():
    lines = [command("task list"), command("plan list")]
    report = overlap_of({FIRST: ("Started", lines), SECOND: ("Started", lines)})
    assert [line for line in report if "reaches nothing" in line] == [f"story reaches nothing the other stories do not: {FIRST}"], report


def test_a_story_with_no_steps_is_not_a_finding():
    assert overlap_of({FIRST: ("Started", []), SECOND: ("Started", [])}) == []


def test_many_stories_are_compared_without_comparing_every_pair():
    paths = {f"file.py::test_{number}": {f"step {number} {part}" for part in range(5)} for number in range(4000)}
    assert StoryOverlap.candidate_pairs(paths) == set()


def test_a_command_is_written_without_its_values():
    assert StoryPath.command(3, ["task", "list", "--state", "open", "--limit=5"], 0) == StoryPath.command(3, ["task", "list", "--state", "closed", "--limit=9"], 0)


def test_a_refused_command_is_another_step_than_a_command_that_ran():
    assert StoryPath.command(3, ["task", "close", "1"], 1) != StoryPath.command(3, ["task", "close", "1"], 0)


def test_a_hook_is_written_as_its_event_and_tool_and_what_the_agent_was_told():
    cart = HookSamples.edit("cart.py")
    tax = HookSamples.edit("tax.py")
    assert StoryPath.hook(cart.action, HookReply.allowed("new message 12")) == StoryPath.hook(tax.action, HookReply.allowed("new message 99"))


def test_a_refused_hook_is_another_step_than_an_allowed_hook():
    stop = HookSamples.stop().action
    assert StoryPath.hook(stop, HookReply(refusal="no")) != StoryPath.hook(stop, HookReply())
