from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted

LOOK = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, [])).with_fields(event="post_tool_use")


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
    story.expect_absent_hook_line("s-1", LOOK, "add an alias")
    for _ in range(5):
        start_process(story, "make build fast")
    assert any("you ran make build fast 8 times" in line for line in story.hook("s-1", LOOK).lines)


def test_reading_all_of_an_output_a_reader_reads_names_the_shorter_read(new_story):
    story = runner_story(new_story)
    story.run('reader add tally --commands "make*" --lines "passed"')
    process = moved_run(story, "make test")
    end_run(story, process, "3 passed in 1s\n" + "x\n" * 300)
    assert any(f"journal output read {process.id} --summary" in line for line in story.hook("s-1", posted(f"journal output read {process.id} --all")).lines)
    story.expect_absent_hook_line("s-1", posted(f"journal output read {process.id} --tail 5"), "already reads output")


def test_a_title_that_is_a_flag_or_a_path_is_named(new_story):
    story = runner_story(new_story)
    process = moved_run(story, "make test")
    story.run(f'output title {process.id} "./build.sh"', actor=story.agent)
    assert any(f"output {process.id}'s title ./build.sh is a flag or a path" in line for line in story.hook("s-1", LOOK).lines)


def test_two_running_outputs_with_one_title_are_named(new_story):
    story = runner_story(new_story)
    first, second = moved_run(story, "make one"), moved_run(story, "make two")
    for process in (first, second):
        story.run(f'output title {process.id} "Build it"', actor=story.agent)
    assert any(f"outputs {first.id}, {second.id} share the title Build it" in line for line in story.hook("s-1", LOOK).lines)


def test_a_title_in_words_says_nothing(new_story):
    story = runner_story(new_story)
    process = moved_run(story, "make test")
    story.run(f'output title {process.id} "Run the cart tests"', actor=story.agent)
    story.expect_absent_hook_line("s-1", LOOK, "is a flag or a path")
