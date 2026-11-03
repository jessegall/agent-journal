from core.base.driver.command_category import CommandCategory
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.queries.reader_query import ReaderQuery
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_an_alias_counts_as_the_line_it_names_and_its_reader_reads_it(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('alias add viewer-test "npx vitest run {args}"', actor=story.agent)
    story.hook("s-1", HookSamples.shell("journal viewer-test cart", ShellPart("journal", CommandCategory.TEST_RUN, ["viewer-test", "cart"])))
    process = story.container.get(ProcessQuery).find(1)
    end_run(story, process, "runner noise\n Tests  12 passed (12)\n")
    story.expect_text("output read 1 --summary", "summary: 12 passed", actor=story.agent)
    story.expect_absent("output read 1 --summary", "runner noise", actor=story.agent)
    story.expect_text("process-part show 1", "command: npx vitest run cart", actor=story.agent)


def test_an_alias_that_names_its_own_reader_reads_with_that_reader(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add viewer --commands "unrelated*" --lines "viewer result"', actor=story.agent)
    story.run('alias add viewer-test "npx vitest run {args}" --reader viewer', actor=story.agent)
    story.hook("s-1", HookSamples.shell("journal viewer-test cart", ShellPart("journal", CommandCategory.TEST_RUN, ["viewer-test", "cart"])))
    process = story.container.get(ProcessQuery).find(1)
    end_run(story, process, "viewer result: done\n Tests  12 passed (12)\n")
    story.expect_text("output read 1 --summary", "viewer result: done", actor=story.agent)
    story.expect_absent("output read 1 --summary", "Tests  12 passed", actor=story.agent)


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


def test_a_reader_that_passes_on_kept_output_records_its_proof(new_story):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, "kept-tests run", category=CommandCategory.TEST_RUN)
    end_run(story, process, "collected 3\n3 passed\n")
    story.expect_success('reader add kept --commands "kept-tests*" --lines "passed" --summary "([0-9]+ passed)" --count "collected ([0-9]+)"',
                         f"proved_on: {process.id}", actor=story.agent)


def test_a_summary_cannot_claim_more_tests_than_the_count(new_story):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, "overcount-tests run", category=CommandCategory.TEST_RUN)
    end_run(story, process, "collected 3\n4 passed\n")
    story.expect_refusal('reader add overcount --commands "overcount-tests*" --lines "passed" --summary "([0-9]+ passed)" --count "collected ([0-9]+)"',
                         f"output {process.id}: --summary exceeds --count", actor=story.agent)


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
    story.expect_refusal('reader add updated --summary "never printed"', f"output {process.id}: --summary found nothing", actor=story.agent)
    story.expect_text(f"reader show {reader}", "summary_pattern: ([0-9]+ passed)", f"proved_on: {process.id}", actor=story.agent)


def test_only_the_five_newest_matching_outputs_are_tried(new_story):
    story = new_story(fixture=BuilderStarted)
    for number in range(6):
        process = start_process(story, "recent-tests run", category=CommandCategory.TEST_RUN)
        end_run(story, process, "old format\n" if number == 0 else "3 passed\n")
    unrelated = start_process(story, "other-tests run", category=CommandCategory.TEST_RUN)
    end_run(story, unrelated, "unrelated format\n")
    story.expect_success('reader add recent --commands "recent-tests*" --lines "passed" --summary "([0-9]+ passed)"',
                         f"proved_on: {process.id}", actor=story.agent)


def test_a_quick_reader_can_omit_fields_when_matching_output_exists(new_story):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, "quick-report", category=CommandCategory.UNKNOWN)
    end_run(story, process, "done\n")
    story.expect_success('reader add quick --commands "quick-report" --lines "done"', f"proved_on: {process.id}", actor=story.agent)
