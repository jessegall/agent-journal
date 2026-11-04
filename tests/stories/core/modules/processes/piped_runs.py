import json

import pytest

from core.base.driver.command_category import CommandCategory
from core.modules.processes.support.runner_line import MOST_OUTPUT_VARIABLE
from tests.stories.core.modules.processes.support.piped_runs import TEST_OUTPUT, PipedRuns
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted, BuilderWithUser
from tests.stories.server.support.server_client import server_story


@pytest.fixture
def piped_runs(new_story):
    story = new_story(fixture=BuilderStarted)
    with server_story(story) as server:
        yield PipedRuns(story, server)


@pytest.mark.parametrize("line,stripped", [
    ("npm test | tail -5", ["npm test"]),
    ("npm run build | grep error", ["npm run build"]),
    ("cat notes.txt | grep x", []),
    ("grep -n x notes.txt | head -3", []),
    ("git log | head -5", []),
    ("ssh host cat notes.txt | head", []),
    ("npm test | tail -5 && git status | head -2", ["npm test"]),
])
def test_only_the_tests_and_builds_of_a_line_go_to_the_runner_to_be_stripped(piped_runs, line, stripped):
    assert piped_runs.stripped_commands(line) == stripped


def test_a_test_gets_a_limit_of_100_megabytes_and_a_read_one_of_10(piped_runs):
    for line, megabytes in (("npm test", 100), ("cat notes.txt", 10)):
        assert piped_runs.variable(line, MOST_OUTPUT_VARIABLE) == str(megabytes << 20)


def test_an_output_limit_of_zero_keeps_one_megabyte(piped_runs):
    piped_runs.story.expect_success("setting set journal.core.processes.most-output-megabytes 0 --environment main", actor=piped_runs.story.user)
    piped_runs.expect_variable("cat notes.txt", MOST_OUTPUT_VARIABLE, str(1 << 20))


def test_a_declared_test_alias_strips_only_its_own_part(piped_runs):
    piped_runs.story.expect_success('alias add all-tests "./check.sh" --category "test run"', actor=piped_runs.story.agent)
    piped_runs.expect_stripped("yes | head -1; journal all-tests --tail 2", "./check.sh")


def test_a_journal_line_gets_the_limit_of_a_read(piped_runs):
    piped_runs.expect_variable("journal environment list", MOST_OUTPUT_VARIABLE, str(10 << 20))


def test_a_setting_changes_the_output_limit(piped_runs):
    piped_runs.story.expect_success("setting set journal.core.processes.most-output-megabytes 2 --environment main", actor=piped_runs.story.user)
    assert piped_runs.variable("cat notes.txt", MOST_OUTPUT_VARIABLE) == str(2 << 20)


def test_a_piped_test_keeps_its_complete_output_for_its_reader(piped_runs):
    _, folder = piped_runs.run_line("npm test | tail -5")
    assert (folder / "1.out").read_text() == TEST_OUTPUT


def test_a_failed_test_behind_a_passing_pipe_fails_the_run(piped_runs):
    piped_runs.fail_the_tests()
    folder = piped_runs.expect_run_output("npm test | tail -2", "line 40\n40 passed\n")
    piped_runs.story.expect_text(f"process show {folder.name}", "state: failed", "exit_code: 1")


def test_a_failed_test_before_a_passing_command_fails_the_run(piped_runs):
    piped_runs.fail_the_tests()
    _, folder = piped_runs.run_line("npm test; echo done")
    piped_runs.story.expect_text(f"process show {folder.name}", "state: failed", "exit_code: 1")


def test_a_passing_test_finishes_the_run(piped_runs):
    _, folder = piped_runs.run_line("npm test | tail -2")
    piped_runs.story.expect_text(f"process show {folder.name}", "state: finished", "exit_code: 0")


def test_what_the_pipes_printed_reads_by_number_past_the_cap(piped_runs):
    folder = piped_runs.expect_run_output("npm test | sed 's/line/a longer line of text/'", "journal output read {process} --piped")
    piped_runs.story.expect_text(f"output read {folder.name} --piped", "a longer line of text 1\n", "a longer line of text 40", actor=piped_runs.story.agent)
    piped_runs.story.expect_no_text(f"output read {folder.name} --piped", "\nline 1\n", actor=piped_runs.story.agent)


def test_a_line_with_no_pipes_run_over_its_output_says_so(piped_runs):
    _, folder = piped_runs.run_line("npm test")
    piped_runs.story.expect_refusal(f"output read {folder.name} --piped", "ran no pipes", actor=piped_runs.story.agent)


def test_a_quick_piped_test_returns_exactly_what_the_pipes_print(piped_runs):
    output, _ = piped_runs.run_line("npm test | tail -2")
    assert output == "line 40\n40 passed\n"


def test_a_quick_piped_build_returns_exactly_what_the_pipes_print(piped_runs):
    output, folder = piped_runs.run_line("npm run build | grep passed")
    assert output == "40 passed\n"
    assert (folder / "1.out").read_text() == TEST_OUTPUT


def test_each_part_of_a_chain_returns_what_the_agent_asked(piped_runs):
    (piped_runs.folder / "notes.txt").write_text("one\ntwo\n")
    output, folder = piped_runs.run_line("npm test | tail -1 && cat notes.txt | head -1")
    assert output == "40 passed\none\n"
    assert (folder / "1.out").read_text() == TEST_OUTPUT
    assert (folder / "3.out").read_text() == "one\n"


def test_a_test_after_an_earlier_pipe_writes_the_file_of_its_position(piped_runs):
    (piped_runs.folder / "notes.txt").write_text("one\ntwo\n")
    output, folder = piped_runs.run_line("cat notes.txt | wc -l && npm test | tail -1")
    assert output.endswith("40 passed\n")
    assert (folder / "3.out").read_text() == TEST_OUTPUT


def test_a_test_after_an_earlier_pipe_is_read_by_its_number(piped_runs):
    (piped_runs.folder / "notes.txt").write_text("one\ntwo\n")
    _, folder = piped_runs.run_line("cat notes.txt | wc -l && npm test | tail -1")
    assert "40 passed" in piped_runs.story.run(f"output peek {folder.name} --all", actor=piped_runs.story.user).output_text
    assert "line 1\n" in piped_runs.story.run(f"output peek {folder.name} --all", actor=piped_runs.story.user).output_text


def test_a_failing_filter_of_a_test_stops_the_chain_as_the_agent_wrote_it(piped_runs):
    output, _ = piped_runs.run_line("npm test | grep -c nothing-here; npm test | tail -1")
    assert output.endswith("40 passed\n")


def test_a_watch_command_keeps_its_pipe_and_stores_what_the_pipe_prints(piped_runs):
    _, folder = piped_runs.run_line("npm test --watch | tail -1")
    assert (folder / "1.out").read_text() == "40 passed\n"


def test_a_quick_test_goes_in_line_and_never_gets_the_background_flag(piped_runs):
    assert "--background" not in piped_runs.rewritten("npm test | tail -2")


def test_a_test_piped_into_tee_stays_as_the_agent_wrote_it(piped_runs):
    piped_runs.run_line("npm test | tee log.txt")
    assert (piped_runs.folder / "log.txt").read_text() == TEST_OUTPUT


def test_a_piped_read_stores_what_the_agent_gets(piped_runs):
    (piped_runs.folder / "notes.txt").write_text("one\ntwo\nthree\n")
    output, folder = piped_runs.run_line("cat notes.txt | tail -1")
    assert output == "three\n"
    assert (folder / "1.out").read_text() == "three\n"


def test_finished_lists_a_short_command_of_the_main_agent(new_story):
    story = install_runner(new_story(fixture=BuilderWithUser))
    process = start_process(story, "git status", category=CommandCategory.VERSION_CONTROL)
    end_run(story, process, "clean\n")
    queue = json.loads(story.run("queue inspect --environment-id 1 --json", actor=story.user).output_text)
    story.expect_rows(process.id in [row["id"] for row in queue["recent"]])
    story.expect_text(f"output peek {process.id} --all", "clean", actor=story.user)
