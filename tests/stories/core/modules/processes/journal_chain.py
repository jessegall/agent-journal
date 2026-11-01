from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner, runner_line
from tests.stories.core.support.coding_fixtures import BuilderStarted

JOURNAL_PART = ShellPart("journal", CommandCategory.JOURNAL, ["task", "show", "1"], subcommand="task")
LISTING_PART = ShellPart("ls", CommandCategory.SEARCH, ["build"])
TESTS_PART = ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"])
REFUSAL = "a journal command may not follow a long command"


def test_a_journal_command_after_a_test_run_is_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_hook_refusal("s-1", HookSamples.shell("pytest -q && journal task show 1", TESTS_PART, JOURNAL_PART), REFUSAL)


def test_a_journal_command_after_a_read_goes_on_through_the_runner(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    line = "ls build && journal task show 1"
    assert dict(story.hook("s-1", HookSamples.shell(line, LISTING_PART, JOURNAL_PART)).updated_input) == {"command": runner_line(story, 1, line)}


def test_a_journal_command_after_journal_and_a_test_run_is_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_hook_refusal("s-1", HookSamples.shell("journal task show 1 && pytest -q && journal task show 1", JOURNAL_PART, TESTS_PART, JOURNAL_PART), REFUSAL)


def test_a_journal_command_inside_a_loop_is_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    loop = ShellPart("for", CommandCategory.PROCESS, ["i"])
    story.expect_hook_refusal("s-1", HookSamples.shell("for i in 1 2; do journal task show 1; done", loop), REFUSAL)


def test_journal_commands_first_and_then_other_commands_go_on_through_the_runner(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    line = "journal task show 1 && journal task show 1 && ls build"
    reply = story.hook("s-1", HookSamples.shell(line, JOURNAL_PART, JOURNAL_PART, LISTING_PART))
    assert dict(reply.updated_input) == {"command": runner_line(story, 1, line)}


def test_a_loop_that_only_names_a_path_with_journal_in_it_goes_on_through_the_runner(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    line = "for f in .journal/a; do cat $f; done"
    reply = story.hook("s-1", HookSamples.shell(line, ShellPart("for", CommandCategory.PROCESS, ["f"])))
    assert dict(reply.updated_input) == {"command": runner_line(story, 1, line)}


def test_a_sleep_poll_followed_by_another_command_is_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    loop = ShellPart("until", CommandCategory.PROCESS, ["pgrep"])
    story.expect_hook_refusal("s-1", HookSamples.shell("until pgrep -f build; do sleep 5; done && ls build", loop, LISTING_PART), "a sleep with nothing to wait on is refused")


def test_a_journal_command_piped_into_a_cutting_program_is_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    piped = ShellPart("journal", CommandCategory.JOURNAL, ["task", "show", "1"], subcommand="task", pipe_target=1)
    grep = ShellPart("grep", CommandCategory.SEARCH, ["state"])
    story.expect_hook_refusal("s-1", HookSamples.shell("journal task show 1 && grep state", piped, grep), "do not cut a journal command with a pipe")


def test_asking_for_a_runs_status_is_answered_with_how_to_set_a_monitor(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    status = HookSamples.shell("journal output status 7", ShellPart("journal", CommandCategory.JOURNAL, ["output", "status", "7"], subcommand="output"))
    story.expect_hook_allowed("s-1", status, "set a Monitor that ends when .journal/processes/7/end exists")


def test_a_test_run_sent_to_a_file_is_told_no_reader_sees_it(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    redirected = ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"], write_paths=["/tmp/results.txt"])
    reply = story.hook("s-1", HookSamples.shell("pytest -q > /tmp/results.txt", redirected))
    assert "pytest goes to a file, so no reader sees it: run it without the redirect, then journal output read <n> --summary" in reply.lines


def test_writing_a_file_or_sending_a_run_to_dev_null_gets_no_such_line(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    writing = ShellPart("cat", CommandCategory.EDIT, [], write_paths=["notes.txt"])
    silent = ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"], write_paths=["/dev/null"])
    reply = story.hook("s-1", HookSamples.shell("cat > notes.txt && pytest -q > /dev/null", writing, silent))
    assert not any("no reader sees it" in line for line in reply.lines)


def test_a_test_run_cut_with_a_pipe_is_told_its_reader_sees_only_what_is_left(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    piped = ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"], pipe_target=1)
    cut = ShellPart("tail", CommandCategory.READ, ["-5"])
    reply = story.hook("s-1", HookSamples.shell("pytest -q && tail -5", piped, cut))
    assert any(line.startswith("pytest is cut by a pipe") for line in reply.lines)
