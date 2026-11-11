from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, worker_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

REPEATED_LINE = HookSamples.shell("make build fast", ShellPart("make", CommandCategory.UNKNOWN, ["build", "fast"])).with_fields(event="post_tool_use")
LONG_OUTPUT_LINES = 150


def posted_read(line):
    return HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:], subcommand="output")).with_fields(event="post_tool_use")


def test_reading_all_of_a_large_output_names_the_shorter_reads_once_for_that_output(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make test")
    end_run(story, process, "x\n" * LONG_OUTPUT_LINES)
    read_all = posted_read(f"journal output read {process.id} --all")
    story.expect_hook_allowed("s-1", read_all, f"output {process.id} has {LONG_OUTPUT_LINES} lines: read it with --summary, --tail K or --lines A-B")
    story.expect_absent_hook_line("s-1", read_all, "lines: read it with")


def test_a_worker_that_runs_one_line_often_is_not_told_to_save_it_as_an_alias(new_story):
    story = install_runner(new_story(fixture=ForcedReaders))
    for _ in range(8):
        worker_run(story, "make build fast", CommandCategory.UNKNOWN)
    story.expect_absent_hook_line("s-reader", REPEATED_LINE, "you ran make build fast")
