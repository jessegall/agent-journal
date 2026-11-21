from unittest.mock import Mock

from engine.enums.command_category import CommandCategory
from engine.row.page import Page
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_judge import FEW_LINES, SAMPLE_OUTPUTS, WIDTH_LINE_COUNT, ReaderJudge
from core.modules.processes.support.reader_check import ReaderCheck


def test_npx_title_validation():
    assert not ReaderJudge.has_argument("Jest tests", "npx jest --runInBand", "npx")
    assert ReaderJudge.has_argument("Cart tests", "npx jest cart", "npx")


def test_a_wrapper_before_the_test_program_is_no_argument():
    assert not ReaderJudge.has_argument("Composer tests", "docker compose exec -T app composer test", "composer")
    assert ReaderJudge.has_argument("Cart tests", "docker compose exec -T app composer test cart", "composer")
from core.modules.processes.support.reader_run import ReaderRun


def reader(**fields: object) -> Reader:
    return Reader(**{"id": 1, "version": 1, "creator_id": 1, "name": "build", "type": ReaderType.PATTERN,
                     "commands": "make*", "title": "Building", "lines_pattern": "done", "summary_pattern": "done", **fields})


def judge() -> ReaderJudge:
    return ReaderJudge(ReaderRun(), Mock(spec=OutputFolder), Mock(spec=ProcessPartQuery))


def test_a_reader_that_picks_no_lines_misses_the_output():
    misses = judge().misses(reader(lines_pattern="FAILED"), CommandCategory.BUILD, "noise\n" * FEW_LINES + "done\n")
    assert "--lines picked none" in misses


def test_a_reader_that_picks_nearly_all_lines_is_too_wide():
    misses = judge().misses(reader(lines_pattern=".*"), CommandCategory.BUILD, "noise\n" * WIDTH_LINE_COUNT + "done\n")
    assert "--lines picked nearly all" in misses


def test_a_reader_that_finds_no_summary_misses_the_output():
    misses = judge().misses(reader(summary_pattern="result"), CommandCategory.BUILD, "done\n")
    assert "--summary found nothing" in misses


def test_a_build_reader_passes_without_progress_when_its_output_prints_no_count():
    build_reader = reader()
    assert judge().fields_missing(build_reader, CommandCategory.BUILD) == ()
    assert judge().misses(build_reader, CommandCategory.BUILD, "compile\ndone\n") == ()


def test_a_check_reader_needs_no_progress_even_when_its_output_prints_a_count():
    assert judge().misses(reader(), CommandCategory.CHECK, "done 2/4\n") == ()


def test_no_tests_ran_is_not_a_sample_result_but_a_real_test_result_still_is():
    counted = reader(count_pattern=r"collected ([0-9]+)")
    assert judge().misses(counted, CommandCategory.TEST_RUN, "collected 0 items\nno tests ran in 1s\n") == ()
    assert "--summary found nothing" in judge().misses(counted, CommandCategory.TEST_RUN, "collected 2 items\nno tests ran in 1s\n")
    assert "--summary found nothing" in judge().misses(counted, CommandCategory.BUILD, "no tests ran in 1s\n")


def test_a_run_that_crashed_before_any_test_says_nothing_about_a_reader():
    counted = reader(count_pattern=r"collected ([0-9]+)", summary_pattern="result", lines_pattern="result")
    crashes = ("Traceback (most recent call last):\n  File x\nNameError: name 'x' is not defined\n", "sh: vitest: command not found\n")
    for text in crashes:
        assert judge().misses(counted, CommandCategory.TEST_RUN, text) == ()
        assert judge().misses(counted, CommandCategory.BUILD, text) == ()
    assert judge().misses(counted, CommandCategory.TEST_RUN, "collected 2 items\nTraceback (most recent call last):\n") != ()


def test_a_test_reader_requires_progress_and_a_build_reader_requires_its_other_fields():
    assert judge().fields_missing(reader(title="Go tests"), CommandCategory.TEST_RUN) == ("--count", "--progress or --step with --count")
    assert judge().fields_missing(reader(title="", lines_pattern="", summary_pattern=""), CommandCategory.BUILD) == ("--title", "--lines or --script", "--summary")


def test_a_test_reader_can_use_steps_and_count_for_progress():
    counted = reader(title="Go tests", count_pattern=r"collected ([0-9]+)", step_pattern="[.FE]")
    assert judge().fields_missing(counted, CommandCategory.TEST_RUN) == ()
    assert "--count found nothing" not in judge().misses(counted, CommandCategory.TEST_RUN, "collected 4\ndone 2/4\n.F\n")
    assert "--progress found nothing" not in judge().misses(counted, CommandCategory.TEST_RUN, "collected 4\ndone 2/4\n.F\n")
    assert "--count found nothing" in judge().misses(counted, CommandCategory.TEST_RUN, "done\n")
    assert "--count found nothing" not in judge().misses(reader(count_command="list-tests"), CommandCategory.TEST_RUN, "done\n")


def test_a_judgement_reports_its_missing_fields_and_misses():
    outcome = ReaderCheck(("--title",), ("--summary found nothing",))
    assert not outcome.is_valid
    assert outcome.text == "--title, --summary found nothing"
    assert ReaderCheck().is_valid
    assert ReaderCheck().text == ""


def test_samples_use_the_newest_matching_kept_parts_up_to_the_limit():
    parts, folder = Mock(spec=ProcessPartQuery), Mock(spec=OutputFolder)
    rows = [ProcessPart(id=position, version=1, process_id=position, position=1, text="journal compile", command="make build", program="journal", category=CommandCategory.BUILD)
            for position in range(SAMPLE_OUTPUTS + 2, 0, -1)]
    rows.insert(0, ProcessPart(id=100, version=1, process_id=100, position=1, text="other", program="other", category=CommandCategory.BUILD))
    sampled = reader()
    parts.kept_samples.return_value.take.return_value = tuple(rows)
    folder.sample_text.side_effect = lambda process_id, position: f"done {process_id}\n"
    outcome = ReaderJudge(ReaderRun(), folder, parts).tested(sampled)
    assert outcome.output_id == SAMPLE_OUTPUTS + 2
    assert outcome.missed == ()
    parts.kept_samples.assert_called_once()
    assert folder.sample_text.call_count == SAMPLE_OUTPUTS


def test_a_part_cut_by_tail_or_head_is_no_sample_of_a_reader():
    folder = Mock(spec=OutputFolder)
    folder.sample_text.side_effect = lambda process_id, position: "app/Models/Order.php does not exist\n" if process_id == 1 else "done\n"
    cut = ProcessPart(id=1, version=1, process_id=1, position=1, text="vendor/bin/phpstan analyse app | tail -15", program="phpstan", category=CommandCategory.BUILD)
    whole = ProcessPart(id=2, version=1, process_id=2, position=1, text="vendor/bin/phpstan analyse app", program="phpstan", category=CommandCategory.BUILD)
    outcome = ReaderJudge(ReaderRun(), folder, Mock(spec=ProcessPartQuery)).tested_samples(reader(), (cut, whole))
    assert (outcome.missed, outcome.output_id) == ((), 2)
