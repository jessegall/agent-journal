from datetime import timedelta

import pytest

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderWithUser

REFUSED = "private command corpus"
SAMPLE_CORPUS = "/work/main/.journal/corpus/sample_corpus.txt"


def shell_line(program: str, line: str, *arguments: str):
    return HookSamples.shell(line, ShellPart(program, CommandCategory.READ, list(arguments))).with_fields(event="pre_tool_use")


@pytest.mark.parametrize("program,line", [
    ("cat", f"cat {SAMPLE_CORPUS}"),
    ("grep", f"grep ls {SAMPLE_CORPUS}"),
    ("head", "head -3 .journal/corpus/sample_corpus.txt"),
    ("python3", f"python3 -c 'print(open(\"{SAMPLE_CORPUS}\").read())'"),
    ("sh", f"sh -c 'while read line; do $line; done' < {SAMPLE_CORPUS}"),
])
def test_a_shell_line_naming_a_file_of_the_private_corpus_is_refused(new_story, program, line):
    story = new_story(fixture=BuilderWithUser)
    story.expect_hook_refusal("s-1", shell_line(program, line, *line.split()[1:]), REFUSED)


def test_the_refusal_has_no_way_past(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_hook_refusal("s-1", shell_line("cat", f"cat {SAMPLE_CORPUS}", SAMPLE_CORPUS), REFUSED)
    story.advance(timedelta(seconds=1))
    story.expect_refusal('refusal skip drivers.private-corpus --reason "I need it" --environment main', "safety refusal", actor=story.agent)
    story.expect_hook_refusal("s-1", shell_line("cat", f"cat {SAMPLE_CORPUS}", SAMPLE_CORPUS), REFUSED)


def test_the_sandboxed_go_test_that_is_handed_the_corpus_path_still_runs(new_story):
    story = new_story(fixture=BuilderWithUser)
    line = f"JOURNAL_CORPUS={SAMPLE_CORPUS} go -C tools/journal-hook test -count=1 -run TestTheCorpusThroughTheReadOnlyRule ./classify"
    story.expect_hook_allowed("s-1", shell_line("go", line, "-C", "tools/journal-hook", "test", "-count=1", "-run", "TestTheCorpusThroughTheReadOnlyRule", "./classify"))


def test_a_line_that_does_not_name_the_corpus_is_not_refused(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_hook_allowed("s-1", shell_line("cat", "cat notes.txt", "notes.txt"))


def test_a_saved_command_that_is_the_sandboxed_go_test_can_be_added(new_story):
    story = new_story(fixture=BuilderWithUser)
    line = f'journal alias add corpus-sample-test "JOURNAL_CORPUS={SAMPLE_CORPUS} go -C tools/journal-hook test -count=1 ./classify" --category "test run"'
    story.expect_hook_allowed("s-1", shell_line("journal", line, "alias", "add", "corpus-sample-test"))


def test_a_saved_command_that_reads_the_corpus_cannot_be_added(new_story):
    story = new_story(fixture=BuilderWithUser)
    line = f'journal alias add corpus-cat "cat {SAMPLE_CORPUS}" --category "read"'
    story.expect_hook_refusal("s-1", shell_line("journal", line, "alias", "add", "corpus-cat"), REFUSED)
