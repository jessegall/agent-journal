from dataclasses import replace

import pytest

from engine.enums.command_category import CommandCategory
from core.modules.processes.models.enums.cadence_state import CadenceState
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.enums.reading_exit import ReadingExit
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.enums.unreadable_reason import UnreadableReason
from core.modules.processes.support.reader_judgement import ReaderJudgement
from core.modules.processes.support.decisions.output_facts import OutputFacts
from core.modules.processes.models.enums.reader_layer import ReaderLayer
from core.modules.processes.support.decisions.reading_case import ReadingCase

TEST_OUTPUT = b"collected 3 items\n\n===== 3 passed in 0.10s =====\n"
RUNNING_TESTS = ReadingCase(command_key="pytest", category=CommandCategory.TEST_RUN, classification_known=True, has_asking_flag=False,
                            output_hidden=False, is_saved_command=False, is_plugin_run=False, moment=ReadingMoment.RUNNING, age_seconds=120,
                            run_state=ProcessState.BACKGROUND, cadence_state=CadenceState.STREAMING, exit_code=None, reader_layer=None, reader_judgement=None, reader_is_default=False, reader_failed=False, draft_fits=False,
                            output=None, runs_without_change=0, request_is_waiting=False, was_skipped=False, has_unreadable_mark=False, count_missing=False,
                            role_must_have_reader=True, role_may_write_readers=True, role_uses_saved_commands=False, readers_forced=True)


def ended(sample: bytes, exit_code: int, age_seconds: int = 120) -> ReadingCase:
    return replace(RUNNING_TESTS, moment=ReadingMoment.END, run_state=ProcessState.FINISHED, exit_code=exit_code, age_seconds=age_seconds,
                   output=OutputFacts.measured(sample, len(sample), exit_code, CommandCategory.TEST_RUN))


def test_a_long_test_run_needs_a_reader():
    assert not RUNNING_TESTS.is_not_needed


@pytest.mark.parametrize("case", [
    replace(RUNNING_TESTS, category=CommandCategory.READ),
    replace(RUNNING_TESTS, category=CommandCategory.JOURNAL),
    replace(RUNNING_TESTS, has_asking_flag=True),
    replace(RUNNING_TESTS, is_plugin_run=True),
    ended(b"usage: pytest [options]\nunrecognized arguments: --tail\n", exit_code=2),
    ended(TEST_OUTPUT, exit_code=0, age_seconds=3),
], ids=["read", "journal", "asking flag", "plugin run", "rejected", "short success"])
def test_reads_journal_commands_asking_flags_plugin_runs_rejected_and_short_successful_runs_need_no_reader(case):
    assert case.is_not_needed


def test_a_short_run_that_failed_still_needs_a_reader():
    assert not ended(b"1 failed\n", exit_code=1, age_seconds=3).is_not_needed


def test_a_reader_is_suitable_only_when_its_judgement_finds_nothing_missing():
    assert not RUNNING_TESTS.reader_is_suitable
    assert replace(RUNNING_TESTS, reader_layer=ReaderLayer.PROJECT, reader_judgement=ReaderJudgement()).reader_is_suitable
    assert not replace(RUNNING_TESTS, reader_layer=ReaderLayer.STOCK, reader_judgement=ReaderJudgement(missing=tuple(["--count"]))).reader_is_suitable


def test_the_unreadable_reason_comes_from_a_mark_first_then_from_the_output():
    assert RUNNING_TESTS.unreadable_reason is None
    assert ended(b"", exit_code=0).unreadable_reason is UnreadableReason.EMPTY
    assert replace(ended(TEST_OUTPUT, exit_code=0), has_unreadable_mark=True).unreadable_reason is UnreadableReason.DECLARED
    assert ended(TEST_OUTPUT, exit_code=0).unreadable_reason is None


@pytest.mark.parametrize("level, exits", [
    (PressureLevel.SUGGEST, (ReadingExit.COMPLY, ReadingExit.DECLARE_UNREADABLE)),
    (PressureLevel.PREVENT, (ReadingExit.COMPLY, ReadingExit.DECLARE_UNREADABLE, ReadingExit.SKIP_WITH_REASON)),
    (PressureLevel.BLOCK, (ReadingExit.COMPLY, ReadingExit.DECLARE_UNREADABLE, ReadingExit.SKIP_WITH_REASON, ReadingExit.EXPIRES,
                           ReadingExit.PERSON_RELEASES, ReadingExit.MAIN_AGENT_HELPS)),
    (PressureLevel.HOLD, (ReadingExit.READ_OUTPUT, ReadingExit.STOP_RUN, ReadingExit.PERSON_RELEASES)),
])
def test_each_level_has_its_exits(level, exits):
    assert RUNNING_TESTS.exits_for(level) == exits


@pytest.mark.parametrize("level", [level for level in PressureLevel if level > PressureLevel.SUGGEST])
def test_every_level_above_a_suggestion_has_an_exit_the_agent_takes_on_its_own(level):
    assert any(not option.needs_other_party for option in RUNNING_TESTS.exits_for(level))


def test_a_command_of_unknown_type_can_also_be_classified():
    assert replace(RUNNING_TESTS, classification_known=False).exits_for(PressureLevel.PREVENT)[-1] is ReadingExit.CLASSIFY


@pytest.mark.parametrize("cadence, reason", [
    (CadenceState.NO_OUTPUT, UnreadableReason.INTERACTIVE),
    (CadenceState.STOPPED_WRITING, UnreadableReason.INTERACTIVE),
    (CadenceState.STREAMING, None),
    (CadenceState.SPARSE, None),
], ids=["no output", "stopped writing", "streaming", "sparse"])
def test_a_prompt_is_interactive_only_when_the_cadence_says_the_output_does_not_grow(cadence, reason):
    sample = b"Installing\nProceed (y/n)?"
    case = replace(RUNNING_TESTS, cadence_state=cadence, output=OutputFacts.measured(sample, len(sample), None, CommandCategory.TEST_RUN))
    assert case.unreadable_reason is reason
