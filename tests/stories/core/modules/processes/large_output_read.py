from engine.driver.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted


def posted(line):
    return HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:], subcommand="output")).with_fields(event="post_tool_use")


def test_reading_all_of_a_short_output_says_nothing(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make test")
    end_run(story, process, "x\n" * 5)
    story.expect_absent_hook_line("s-1", posted(f"journal output read {process.id} --all"), "lines: read it with")


def test_the_limit_is_a_setting(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run("setting make journal.core.processes.large-output-lines 2")
    process = moved_run(story, "make test")
    end_run(story, process, "x\n" * 5)
    story.expect_hook_allowed("s-1", posted(f"journal output read {process.id} --all"), f"output {process.id} has 5 lines")
