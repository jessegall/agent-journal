import json
from pathlib import Path

from core.base.driver.command_category import CommandCategory
from core.base.driver.part import Part
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner, runner_line
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.testing.expect_reply import expect_absent_reply_line
from tests.stories.support.story_checks import expect_updated_input_reply

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
    expect_updated_input_hook_3(story, "s-1", line, LISTING_PART, JOURNAL_PART, {"command": runner_line(story, 1, line)})


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
    expect_updated_input_reply(reply, {"command": runner_line(story, 1, line)})


def test_a_loop_that_only_names_a_path_with_journal_in_it_goes_on_through_the_runner(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    line = "for f in .journal/a; do cat $f; done"
    reply = story.hook("s-1", HookSamples.shell(line, ShellPart("for", CommandCategory.PROCESS, ["f"])))
    expect_updated_input_reply(reply, {"command": runner_line(story, 1, line)})


def test_a_loop_whose_commit_message_holds_the_words_journal_agent_stays_allowed(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    line = 'for f in a b; do git commit -m "fix it; journal agent main now do journal agent main" $f; done'
    reply = story.hook("s-1", HookSamples.shell(line, ShellPart("for", CommandCategory.PROCESS, ["f"])))
    expect_updated_input_reply(reply, {"command": runner_line(story, 1, line)})


def test_a_sleep_poll_followed_by_another_command_is_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    loop = ShellPart("until", CommandCategory.PROCESS, ["pgrep"])
    story.expect_hook_refusal("s-1", HookSamples.shell("until pgrep -f build; do sleep 5; done && ls build", loop, LISTING_PART), "a sleep is refused")


def test_a_journal_command_piped_into_a_cutting_program_is_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    piped = ShellPart("journal", CommandCategory.JOURNAL, ["task", "show", "1"], subcommand="task", pipe_target=1)
    grep = ShellPart("grep", CommandCategory.SEARCH, ["state"])
    story.expect_hook_refusal("s-1", HookSamples.shell("journal task show 1 && grep state", piped, grep), "do not cut a journal command with a pipe")


def test_asking_for_a_runs_status_is_answered_with_how_to_set_a_monitor(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    status = HookSamples.shell("journal output status 7", ShellPart("journal", CommandCategory.JOURNAL, ["output", "status", "7"], subcommand="output"))
    story.expect_hook_allowed("s-1", status, "set a Monitor on the command journal output monitor 7")


REDIRECT_REFUSAL = "pytest goes to a file, so no reader sees it: run it without the redirect, and read it by its output number"


def test_a_test_run_sent_to_a_file_or_to_dev_null_is_refused_as_a_whole_tool_call(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    for line, redirect in (("pytest -q > /tmp/results.txt", "> /tmp/results.txt"), ("pytest -q >> /tmp/results.txt", ">> /tmp/results.txt"), ("pytest -q &> /tmp/results.txt", "&> /tmp/results.txt"), ("pytest -q > /dev/null", "> /dev/null")):
        story.expect_hook_refusal("s-1", HookSamples.shell(line, TESTS_PART, redirects=[redirect]), REDIRECT_REFUSAL)


def test_a_test_run_inside_a_group_sent_to_a_file_is_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_hook_refusal("s-1", HookSamples.shell("{ pytest -q; } > /tmp/results.txt", TESTS_PART, redirects=["> /tmp/results.txt"]), REDIRECT_REFUSAL)


def test_a_redirect_in_another_part_of_the_chain_does_not_refuse_the_run(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    writing = ShellPart("cat", CommandCategory.EDIT, [], output_paths=["notes.txt"])
    run = TESTS_PART
    story.expect_hook_allowed("s-1", HookSamples.shell("cat > notes.txt && pytest -q", writing, run, redirects=["> notes.txt"]))


def test_a_run_keeping_its_standard_output_or_a_command_that_is_no_run_stays_allowed(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    for redirect in ("2>&1", "2> /tmp/errors.txt", "2>/dev/null"):
        story.expect_hook_allowed("s-1", HookSamples.shell(f"pytest -q {redirect}", TESTS_PART, redirects=[redirect]))
    story.expect_hook_allowed("s-1", HookSamples.shell("cat > notes.txt", ShellPart("cat", CommandCategory.EDIT, [], output_paths=["notes.txt"]), redirects=["> notes.txt"]))


def test_a_parts_write_paths_are_read_from_the_field_the_hook_client_sends():
    schema = json.loads((Path(__file__).parents[5] / "tools/journal-hook/event/hook_event.schema.json").read_text())
    expect_dumps_with(schema, '"write_paths"')
    part = {"text": "cat > notes.txt", "program": "cat", "arguments": [], "classification": {"category": CommandCategory.EDIT.value, "effects": []}, "write_paths": ["notes.txt"]}
    expect_output_paths_parsed(part, ["notes.txt"])


def test_a_test_run_with_a_pipe_gets_no_warning_since_its_output_stays_whole(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    piped = ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"], pipe_target=1)
    cut = ShellPart("tail", CommandCategory.READ, ["-5"])
    reply = story.hook("s-1", HookSamples.shell("pytest -q && tail -5", piped, cut))
    expect_absent_reply_line(reply, "cut by a pipe")


def expect_output_paths_parsed(part, expected) -> None:
    actual = list(Part.parsed(part).output_paths)
    assert actual == expected, actual


def expect_dumps_with(schema, expected) -> None:
    actual = json.dumps(schema)
    assert expected in actual, actual


def expect_updated_input_hook_3(story, text, line, item, item_2, expected) -> None:
    actual = dict(story.hook(text, HookSamples.shell(line, item, item_2)).updated_input)
    assert actual == expected, actual


def test_commands_that_count_as_reading_refuse_redirects_and_pipes(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    commands = ("overview", "task overview 1", "plan context 1", "worker logs 2", "merger next", "message read 3", "message unread", "proof list --task 1", "output read 4 --all", "worker status", "memory list")
    for command in commands:
        arguments = command.split()
        part = ShellPart("journal", CommandCategory.JOURNAL, arguments, subcommand=arguments[0])
        story.expect_hook_refusal("s-1", HookSamples.shell(f"journal {command} > /tmp/out", part, redirects=["> /tmp/out"]), "run the read command directly, without a pipe or redirect")
        piped = ShellPart("journal", CommandCategory.JOURNAL, arguments, subcommand=arguments[0], pipe_target=1)
        sink = ShellPart("cat", CommandCategory.READ, [])
        story.expect_hook_refusal("s-1", HookSamples.shell(f"journal {command} && cat", piped, sink), "run the read command directly, without a pipe or redirect")


def test_a_read_command_can_follow_an_unrelated_redirect(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    writer = ShellPart("cat", CommandCategory.EDIT, [], output_paths=["notes.txt"])
    reader = ShellPart("journal", CommandCategory.JOURNAL, ["message", "read", "3"], subcommand="message")
    story.expect_hook_allowed("s-1", HookSamples.shell("cat > notes.txt && journal message read 3", writer, reader, redirects=["> notes.txt"]))


def test_a_read_command_inside_a_redirected_group_is_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    group = ShellPart("{", CommandCategory.UNKNOWN, [])
    story.expect_hook_refusal("s-1", HookSamples.shell("{ journal worker logs 2; } > /tmp/log", group, redirects=["> /tmp/log"]), "run the read command directly, without a pipe or redirect")


def test_a_read_command_inside_command_substitution_is_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    command = ShellPart("echo", CommandCategory.UNKNOWN, [])
    story.expect_hook_refusal("s-1", HookSamples.shell("echo $(journal message read 3)", command), "run the read command directly, without a pipe or redirect")


def test_words_about_a_read_command_do_not_refuse_a_shell_line(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    command = ShellPart("echo", CommandCategory.READ, ["journal message read 3"])
    story.expect_hook_allowed("s-1", HookSamples.shell("echo 'journal message read 3'", command))
