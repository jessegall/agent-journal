from core.modules.processes.queries.conditions.reader_sample_scope import ReaderSampleScope
from engine.module.module_actors import ModuleActors
import pytest

from engine.command.bus import Bus
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.support.part_spec import PartSpec
from core.modules.processes.support.reader_demands import ReaderDemands
from core.modules.processes.support.reader_judge import ReaderJudge
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, reader_worker, worker_run
from tests.stories.core.modules.processes.support.process_samples import moved_run
from engine.enums.command_category import CommandCategory
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.queries.reader_query import ReaderQuery
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_value_line


def test_an_alias_counts_as_the_line_it_names_and_its_reader_reads_it(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('alias add viewer-test "npx vitest run {args}"', actor=story.agent)
    story.hook("s-1", HookSamples.shell("journal viewer-test cart", ShellPart("journal", CommandCategory.TEST_RUN, ["viewer-test", "cart"])))
    process = story.container.get(ProcessQuery).find(1)
    end_run(story, process, "runner noise\n Tests  12 passed (12)\n")
    story.expect_text("output read 1 --summary", "summary: 12 passed", actor=story.agent)
    story.expect_absent("output read 1 --summary --again", "runner noise", actor=story.agent)
    story.expect_text("process-part show 1", "command: npx vitest run cart", actor=story.agent)


def test_a_stock_reader_reads_a_test_behind_a_variable_and_no_reader_is_asked_for(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = start_process(story, "CI=1 npx vitest run", category=CommandCategory.TEST_RUN)
    end_run(story, process, "runner noise\n Tests  12 passed (12)\n")
    story.expect_text(f"output read {process.id} --summary", "summary: 12 passed", actor=story.agent)
    story.expect_success("reader-request list", "nothing found", actor=story.agent)


def test_a_crashed_sample_does_not_make_a_working_reader_lose_its_standing(new_story):
    story = new_story(fixture=ForcedReaders)
    process = start_process(story, "pytest tests", category=CommandCategory.TEST_RUN)
    end_run(story, process, "collected 3 items\n... [100%]\n3 passed in 1.00s\n")
    crashed = start_process(story, "pytest tests", category=CommandCategory.TEST_RUN)
    end_run(story, crashed, "pytest could not load a package\n", exit_code=1)
    worker_run(story, "pytest tests", CommandCategory.TEST_RUN)
    story.expect_rows(not story.container.get(ReaderRequestQuery).open().exists())


@pytest.mark.parametrize("exit_code, text", [(0, "collected 3 items\n.. [ 66%]\n+++++++++++++ Timeout +++++++++++++\n"), (143, "collected 3 items\n.. [ 66%]\n"), (-9, "collected 3 items\n")],
                         ids=["timeout line", "terminated", "killed"])
def test_a_run_that_was_killed_before_its_summary_asks_for_no_reader(new_story, exit_code, text):
    story = new_story(fixture=ForcedReaders)
    process = start_process(story, "pytest tests", category=CommandCategory.TEST_RUN)
    end_run(story, process, "collected 3 items\n... [100%]\n3 passed in 1.00s\n")
    killed = start_process(story, "pytest tests", category=CommandCategory.TEST_RUN)
    end_run(story, killed, text, exit_code=exit_code)
    end_run(story, worker_run(story, "pytest tests", CommandCategory.TEST_RUN), "collected 3 items\n... [100%]\n3 passed in 1.00s\n")
    story.expect_rows(not story.container.get(ReaderRequestQuery).open().exists())


def test_the_stock_pytest_reader_takes_a_timeout_line_as_the_summary(new_story):
    story = new_story(fixture=ForcedReaders)
    process = start_process(story, "pytest tests", category=CommandCategory.TEST_RUN)
    end_run(story, process, "collected 3 items\n.. [ 66%]\n+++++++++++++ Timeout +++++++++++++\n", exit_code=1)
    story.expect_text(f"output read {process.id} --summary", "Timeout", actor=story.agent)


def test_an_alias_that_names_its_own_reader_reads_with_that_reader(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add viewer --commands "unrelated*" --lines "viewer result"', actor=story.agent)
    story.run('alias add viewer-test "npx vitest run {args}" --reader viewer', actor=story.agent)
    story.hook("s-1", HookSamples.shell("journal viewer-test cart", ShellPart("journal", CommandCategory.TEST_RUN, ["viewer-test", "cart"])))
    process = story.container.get(ProcessQuery).find(1)
    end_run(story, process, "viewer result: done\n Tests  12 passed (12)\n")
    story.expect_text("output read 1 --summary", "viewer result: done", actor=story.agent)
    story.expect_absent("output read 1 --summary --again", "Tests  12 passed", actor=story.agent)


def test_a_reader_that_finds_no_summary_on_a_kept_output_is_refused_naming_the_output(new_story):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, "cart-tests run", category=CommandCategory.TEST_RUN)
    end_run(story, process, "collected 3\n3 passed\n")
    story.expect_refusal('reader add tests --commands "cart-tests*" --lines "passed" --summary "never printed"',
                         f"reader tests missed on output {process.id}: --summary found nothing", actor=story.agent)
    story.expect_absent("reader list", "cart-tests*", actor=story.agent)


def test_a_reader_with_no_kept_output_is_saved_and_judged_on_its_first_run(new_story):
    story = new_story(fixture=BuilderStarted)
    reader = story.new_row_id('reader add first-run --commands "first-tests*" --lines "passed" --summary "([0-9]+ passed)"', actor=story.agent)
    story.expect_rows(story.container.get(ReaderQuery).find(reader).proved_on is None)
    process = start_process(story, "first-tests run", category=CommandCategory.TEST_RUN)
    end_run(story, process, "3 passed\n")
    story.expect_text(f"reader show {reader}", f"proved_on: {process.id}", actor=story.agent)


def test_a_summary_cannot_claim_more_tests_than_the_count(new_story):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, "overcount-tests run", category=CommandCategory.TEST_RUN)
    end_run(story, process, "collected 3\n4 passed\n")
    story.expect_refusal('reader add overcount --commands "overcount-tests*" --lines "passed" --summary "([0-9]+ passed)" --count "collected ([0-9]+)"',
                         f"Output {process.id}: --summary names 4 tests but --count found 3", actor=story.agent)


def test_a_reader_that_misses_its_first_run_stays_unproved(new_story):
    story = new_story(fixture=BuilderStarted)
    reader = story.new_row_id('reader add missed --commands "missed-tests*" --lines "passed" --summary "never printed"', actor=story.agent)
    process = start_process(story, "missed-tests run", category=CommandCategory.TEST_RUN)
    end_run(story, process, "3 passed\n")
    story.expect_rows(story.container.get(ReaderQuery).find(reader).proved_on is None)


def test_a_failed_reader_update_keeps_the_reader_that_passed(new_story):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, "update-tests run", category=CommandCategory.TEST_RUN)
    end_run(story, process, "3 passed\n")
    reader = story.new_row_id('reader add updated --commands "update-tests*" --lines "passed" --summary "([0-9]+ passed)"', actor=story.agent)
    story.expect_refusal('reader add updated --summary "never printed"', f"Output {process.id}: --summary found nothing", actor=story.agent)
    story.expect_text(f"reader show {reader}", "summary_pattern: ([0-9]+ passed)", f"proved_on: {process.id}", actor=story.agent)


def test_each_part_of_a_chain_is_judged_alone(new_story):
    story = new_story(fixture=ForcedReaders)
    worker = reader_worker(story)
    parts = (PartSpec("custom-tests a", "custom-tests", category=CommandCategory.TEST_RUN),
             PartSpec("custom-build run", "custom-build", category=CommandCategory.BUILD),
             PartSpec("ls", "ls", category=CommandCategory.READ))
    story.container.get(Bus).run(StartProcess(worker.id, None, "custom-tests a && custom-build run && ls", "/work/main", "zsh", CommandCategory.TEST_RUN, 30, parts), worker, environment_id=1)
    story.expect_rows(story.container.get(ReaderRequestQuery).open().count() == 1)


def test_a_read_a_search_and_a_journal_command_never_need_a_reader(new_story):
    story = new_story(fixture=BuilderStarted)
    demands = story.container.get(ReaderDemands)
    for category in (CommandCategory.READ, CommandCategory.SEARCH, CommandCategory.JOURNAL):
        story.expect_rows(not demands.needs_reader(PartSpec("read", "read", category=category)))


def test_a_quick_check_needs_no_reader_until_a_run_of_it_moved_to_the_background(new_story):
    story = new_story(fixture=BuilderStarted)
    demands = story.container.get(ReaderDemands)
    part = PartSpec("custom-check src", "custom-check", category=CommandCategory.CHECK)
    story.expect_rows(not demands.needs_reader(part))
    moved_run(story, part.text, CommandCategory.CHECK)
    story.expect_rows(demands.needs_reader(part))


def test_a_help_or_version_line_of_a_test_tool_needs_no_reader(new_story):
    story = new_story(fixture=BuilderStarted)
    for flag in ("--help", "--version", "--collect-only", "--list-tests"):
        story.expect_rows(not story.container.get(ReaderDemands).needs_reader(PartSpec(f"pytest {flag}", "pytest", category=CommandCategory.TEST_RUN)))


def test_a_test_reader_with_no_count_is_not_proper_and_a_build_reader_with_none_is(new_story):
    story = new_story(fixture=BuilderStarted)
    reader = Reader(creator_id=story.agent.id, name="proper", type=ReaderType.PATTERN, commands="custom*", title="Building", lines_pattern="done", summary_pattern="done")
    demands = story.container.get(ReaderDemands)
    story.expect_rows("--count" in demands.reason(PartSpec("custom test", "custom", category=CommandCategory.TEST_RUN), reader, ReaderSampleScope(story.agent.id, "custom test")))
    story.expect_rows(not demands.reason(PartSpec("custom build", "custom", category=CommandCategory.BUILD), reader, ReaderSampleScope(story.agent.id, "custom build")))


def test_a_run_the_journal_started_is_never_held(new_story):
    story = new_story(fixture=ForcedReaders)
    worker = reader_worker(story)
    actor = story.container.get(ModuleActors).actor("journal.core.processes")
    story.container.get(Bus).run(StartProcess.single_part(worker.id, "module-build run", "/work/main", CommandCategory.BUILD, 30), actor, environment_id=1)
    story.expect_rows(not story.container.get(ReaderRequestQuery).open().exists())


def test_a_quiet_run_and_an_empty_output_do_not_make_the_stock_test_reader_poor(new_story):
    story = new_story(fixture=BuilderStarted)
    judge = story.container.get(ReaderJudge)
    reader = story.container.get(ReaderQuery).filter(name="pytest").page(1, 1).rows[0]
    expect_misses_judge(judge, reader, "", ())
    expect_misses_judge(judge, reader, "...  [100%]\n3 passed, 11 deselected in 1.15s\n", ())


def test_a_test_reader_title_cannot_contain_a_path_or_flag(new_story):
    story = new_story(fixture=BuilderStarted)
    reader_id = story.new_row_id('reader add titled --commands "go*test*" --title "Go tests ./..." --lines "FAIL" --summary "FAIL" --count "total ([0-9]+)" --progress "([0-9]+)%"', actor=story.agent)
    reader = story.container.get(ReaderQuery).find(reader_id)
    missing = story.container.get(ReaderJudge).fields_missing(reader, CommandCategory.TEST_RUN)
    expect_value_line(missing, "without paths, flags or command arguments")


def expect_misses_judge(judge, reader, text, expected) -> None:
    actual = judge.misses(reader, CommandCategory.TEST_RUN, text)
    assert actual == expected, actual


def test_a_number_in_the_summary_that_is_no_test_count_is_not_compared(new_story):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, "go-stories run", category=CommandCategory.TEST_RUN)
    end_run(story, process, "--- PASS: TestOne\n--- FAIL: TestTwo\nFAIL\tgithub.com/example/stories/workers 41.2s\n")
    story.expect_success('reader add go-stories --commands "go-stories*" --lines "^--- " --summary "^(?:ok|FAIL)\\s.*" --count "^--- (?:PASS|FAIL): Test"',
                         f"proved_on: {process.id}", actor=story.agent)
