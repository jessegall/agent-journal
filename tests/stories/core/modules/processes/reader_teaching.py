from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run, start_process
from tests.stories.core.modules.processes.support.reader_teaching_fixtures import SameTitleTwoRuns
from tests.stories.core.support.coding_fixtures import BuilderStarted

VIEW_LINE = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, [])).with_fields(event="post_tool_use")

IDENTICAL_LINE = HookSamples.shell("make build fast", ShellPart("make", CommandCategory.UNKNOWN, ["build", "fast"])).with_fields(event="post_tool_use")


def posted(line):
    return HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:], subcommand="output")).with_fields(event="post_tool_use")


def runner_story(new_story):
    return install_runner(new_story(fixture=BuilderStarted))


def test_a_short_run_moved_to_the_background_keeps_its_output_and_summary(new_story):
    story = runner_story(new_story)
    story.run('reader add tally --commands "make*" --lines "passed" --summary "([0-9]+ passed)"')
    process = moved_run(story, "make test")
    end_run(story, process, "3 passed in 1s\n")
    story.expect_text(f"output read {process.id} --summary", "summary: 3 passed", actor=story.agent)


def test_a_short_run_in_the_foreground_keeps_no_output(new_story):
    story = runner_story(new_story)
    process = start_process(story, "make test")
    end_run(story, process, "done\n")
    story.expect_absent("output list", "make test", actor=story.agent)


def test_a_line_run_often_teaches_an_alias_and_a_rare_one_does_not(new_story):
    story = runner_story(new_story)
    for _ in range(3):
        start_process(story, "make build fast")
    story.expect_absent_hook_line("s-1", IDENTICAL_LINE, "add an alias")
    for _ in range(5):
        start_process(story, "make build fast")
    story.expect_hook_allowed("s-1", IDENTICAL_LINE, "you ran make build fast 8 times")
    story.expect_absent_hook_line("s-1", VIEW_LINE, "add an alias")


def test_reading_all_of_an_output_a_reader_reads_names_the_shorter_read(new_story):
    story = runner_story(new_story)
    story.run('reader add tally --commands "make*" --lines "passed"')
    process = moved_run(story, "make test")
    end_run(story, process, "3 passed in 1s\n" + "x\n" * 300)
    story.expect_hook_allowed("s-1", posted(f"journal output read {process.id} --all"), f"reader tally already reads output {process.id}")
    story.expect_absent_hook_line("s-1", posted(f"journal output read {process.id} --tail 5"), "already reads output")


def test_a_title_that_holds_a_flag_or_a_path_is_refused_and_a_readers_title_is_not_judged(new_story):
    story = runner_story(new_story)
    process = moved_run(story, "make test")
    for title in ("Running ./build.sh", "Running the tests -q", "Running tests/unit/cart"):
        story.expect_refusal(f'output title {process.id} "{title}"', "contains a flag or a path", actor=story.agent)
    story.expect_success(f'output title {process.id} "Running the cart tests"', actor=story.agent)
    story.run('reader add tally --commands "pytest*" --title "Running tests" --topic "tests/(\\S+)"')
    start_process(story, "pytest tests/unit/cart")
    story.expect_absent_hook_line("s-1", VIEW_LINE, "flag or a path")


def test_two_running_outputs_with_one_title_are_named(new_story):
    story = new_story(fixture=SameTitleTwoRuns)
    story.expect_hook_allowed("s-1", VIEW_LINE, "outputs 1, 2 share one title")


def test_a_line_already_said_in_a_turn_is_not_said_again_until_the_next_turn(new_story):
    story = new_story(fixture=SameTitleTwoRuns)
    shared = "outputs 1, 2 share one title"
    story.hook("s-1", HookSamples.prompt("go on"))
    story.advance(timedelta(seconds=1))
    story.expect_hook_allowed("s-1", VIEW_LINE, shared)
    story.advance(timedelta(minutes=11))
    story.expect_absent_hook_line("s-1", VIEW_LINE, shared)
    story.advance(timedelta(seconds=1))
    story.hook("s-1", HookSamples.prompt("and again"))
    story.advance(timedelta(seconds=1))
    story.expect_hook_allowed("s-1", VIEW_LINE, shared)


def test_a_title_in_words_says_nothing(new_story):
    story = runner_story(new_story)
    process = moved_run(story, "make test")
    story.run(f'output title {process.id} "Running the cart tests"', actor=story.agent)
    story.expect_absent_hook_line("s-1", VIEW_LINE, "is a flag or a path")
