from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, worker_run
from tests.stories.core.modules.processes.support.reading_scenarios import LONG_OUTPUT_LINES, large_background_output
from tests.stories.core.support.coding_fixtures import BuilderStarted

REPEATED_LINE = HookSamples.shell("make build fast", ShellPart("make", CommandCategory.UNKNOWN, ["build", "fast"])).with_fields(event="post_tool_use")


def posted_read(line):
    return HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:], subcommand="output")).with_fields(event="post_tool_use")


def test_a_worker_whose_role_saves_no_commands_is_not_told_to_save_a_line_it_runs_often_as_an_alias(new_story):
    story = install_runner(new_story(fixture=ForcedReaders))
    for _ in range(8):
        worker_run(story, "make build fast", CommandCategory.UNKNOWN)
    story.expect_absent_hook_line("s-reader", REPEATED_LINE, "you ran make build fast")


def test_reading_all_of_a_large_output_names_the_shorter_reads_once_for_that_output(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = large_background_output(story)
    read_all = posted_read(f"journal output read {process.id} --all")
    story.expect_hook_allowed("s-1", read_all, f"output {process.id} has {LONG_OUTPUT_LINES} lines: read it with --summary, --tail K or --lines A-B")
    story.expect_absent_hook_line("s-1", read_all, "lines: read it with")
