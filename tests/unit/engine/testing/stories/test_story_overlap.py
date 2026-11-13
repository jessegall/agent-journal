from engine.testing.stories.story_fixture import StoryFixture
from engine.testing.stories.story_overlap import StoryOverlap
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_path import StoryPath
from engine.driver.hook_reply import HookReply

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


def test_refusals_for_different_reasons_are_different_steps_and_their_numbers_do_not_count():
    close = ["task", "close", "1"]
    assert StoryPath.command(3, close, 1, "task 1 is blocked\nmore") == StoryPath.command(3, close, 1, "task 7 is blocked")
    assert StoryPath.command(3, close, 1, "task 1 is blocked") != StoryPath.command(3, close, 1, "task 1 has no proof")
    stop = HookSamples.stop().action
    assert StoryPath.hook(stop, HookReply(refusal="message 4 is unread")) != StoryPath.hook(stop, HookReply(refusal="task 4 is in hand"))


def test_a_hook_is_written_as_its_event_and_tool_and_what_the_agent_was_told():
    cart = HookSamples.edit("cart.py")
    tax = HookSamples.edit("tax.py")
    assert StoryPath.hook(cart.action, HookReply.allowed("new message 12")) == StoryPath.hook(tax.action, HookReply.allowed("new message 99"))


def test_a_refused_hook_is_another_step_than_an_allowed_hook():
    stop = HookSamples.stop().action
    assert StoryPath.hook(stop, HookReply(refusal="no")) != StoryPath.hook(stop, HookReply())


def overlap_with_fixtures(stories: dict[str, tuple[str, str, list[str]]]) -> StoryOverlap:
    overlap = StoryOverlap()
    for test_id, (start, fixture, lines) in stories.items():
        overlap.add(test_id, start, lines, lines, fixture)
    return overlap


def test_a_story_that_starts_from_no_fixture_is_named_with_a_fixture_of_its_folder():
    lines = [command("task list")]
    overlap = overlap_with_fixtures({"stories/tasks/a.py::test_first": ("Started", "Started", lines), "stories/tasks/b.py::test_bare": ("", "", lines)})
    assert overlap.no_fixture_lines() == ["story starts from no fixture, start it from Started or a fixture built on it: stories/tasks/b.py::test_bare"]


def test_a_story_that_starts_from_no_fixture_in_a_folder_of_bare_stories_is_told_to_write_one():
    overlap = overlap_with_fixtures({"stories/tasks/a.py::test_bare": ("", "", [command("task list")])})
    assert overlap.no_fixture_lines() == ["story starts from no fixture, write a StoryFixture for its start and use it: stories/tasks/a.py::test_bare"]


def test_the_cases_of_one_story_with_a_fixture_are_not_named_as_without_one():
    lines = [command("task list")]
    assert overlap_with_fixtures({f"{FIRST}[one]": ("Started", "Started", lines), f"{FIRST}[two]": ("Started", "Started", lines)}).no_fixture_lines() == []


def test_stories_of_different_files_that_open_with_the_same_three_steps_are_named():
    opening = [command("task list"), command("plan list"), command("doc list")]
    overlap = overlap_with_fixtures({FIRST: ("Started", "Started", [*opening, command("task show")]), SECOND: ("Started", "Started", [*opening, command("plan show")]),
                                     THIRD: ("Started", "Started", [command("agent list")])})
    assert overlap.file_opening_lines() == [f"stories of 2 files share their first 3 steps, move them into a fixture: {FIRST}, {SECOND}"]


def test_stories_of_one_file_are_not_named_as_sharing_an_opening_across_files():
    opening = [command("task list"), command("plan list"), command("doc list")]
    overlap = overlap_with_fixtures({"a.py::test_one": ("Started", "Started", opening), "a.py::test_two": ("Started", "Started", opening)})
    assert overlap.file_opening_lines() == []


def test_two_steps_in_common_across_files_are_not_an_opening_to_move():
    opening = [command("task list"), command("plan list")]
    overlap = overlap_with_fixtures({FIRST: ("Started", "Started", [*opening, command("doc list")]), SECOND: ("Started", "Started", [*opening, command("doc show")])})
    assert overlap.file_opening_lines() == []


def test_the_same_opening_from_another_start_is_not_shared():
    opening = [command("task list"), command("plan list"), command("doc list")]
    assert overlap_with_fixtures({FIRST: ("Started", "Started", opening), SECOND: ("Joined", "Joined", opening)}).file_opening_lines() == []


def test_a_fixture_that_builds_on_another_and_adds_no_step_is_named():
    class Base(StoryFixture):
        def steps(self, story):
            story.expect_success("actor list")

    class Empty(Base):
        parent = Base

        def steps(self, story):
            return None

    class Inherits(Base):
        parent = Base

    class Adds(Base):
        parent = Base

        def steps(self, story):
            story.expect_success("task list")

    named = StoryOverlap.empty_fixture_lines([Base, Empty, Inherits, Adds])
    assert [line.rpartition(".")[2] for line in named] == ["Empty", "Inherits"], named
    assert all("adds no step to Base" in line for line in named)
