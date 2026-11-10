from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import UserBuilder

REFUSED = "private command corpus"
SAMPLE_CORPUS = "/work/main/.journal/corpus/sample_corpus.txt"


def shell_line(program: str, line: str, *arguments: str):
    return HookSamples.shell(line, ShellPart(program, CommandCategory.READ, list(arguments))).with_fields(event="pre_tool_use")


def test_the_refusal_has_no_way_past(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_hook_refusal("s-1", shell_line("cat", f"cat {SAMPLE_CORPUS}", SAMPLE_CORPUS), REFUSED)
    story.advance(timedelta(seconds=1))
    story.expect_refusal('refusal skip drivers.private-corpus --reason "I need it" --environment main', "safety refusal", actor=story.agent)
    story.expect_hook_refusal("s-1", shell_line("cat", f"cat {SAMPLE_CORPUS}", SAMPLE_CORPUS), REFUSED)
