import pytest

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import CodingEnvironment

PROGRAMS = ("claude", "codex")


def started(story, program: str, session: str) -> None:
    story.hook(session, HookSamples.session_start().with_fields(program=program, session=session))


@pytest.mark.parametrize("program", PROGRAMS)
def test_a_start_gives_the_agent_its_first_lines_with_the_overview_pointer(new_story, program):
    story = new_story(fixture=CodingEnvironment)
    answer = story.hook("s-9", HookSamples.session_start().with_fields(program=program, session="s-9"))
    story.expect_rows(any("overview" in line for line in answer.lines), detail=str(answer.lines))


@pytest.mark.parametrize("program", PROGRAMS)
def test_a_refused_write_reaches_the_agent_with_its_reason(new_story, program):
    story = new_story(fixture=CodingEnvironment)
    started(story, program, "s-9")
    answer = story.hook("s-9", HookSamples.tool_use("Write", "write", ["notes.txt"], None).with_fields(program=program, session="s-9"))
    story.expect_rows("overview" in answer.refusal, detail=answer.refusal)


@pytest.mark.parametrize("program", PROGRAMS)
def test_an_allowed_read_comes_back_with_no_refusal(new_story, program):
    story = new_story(fixture=CodingEnvironment)
    started(story, program, "s-9")
    answer = story.hook("s-9", HookSamples.tool_use("Read", "read", ["README.md"], None).with_fields(program=program, session="s-9"))
    story.expect_rows(answer.refusal == "", detail=answer.refusal)
