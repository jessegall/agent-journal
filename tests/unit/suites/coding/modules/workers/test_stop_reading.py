from dataclasses import replace

import pytest

from suites.coding.modules.workers.support.stop_reading import StopFacts, StopLineTarget, StopReading

DELEGATED_STOP = StopFacts(is_work_under_way=False, is_person_stop=False, has_launch_failed=False, is_delegated=True, is_resume_limit_reached=False,
                           has_requested_help=False, is_program_ready=True)


@pytest.mark.parametrize("facts, reading", [
    (replace(DELEGATED_STOP, is_work_under_way=True), StopReading.WORK_UNDER_WAY),
    (replace(DELEGATED_STOP, is_person_stop=True, is_work_under_way=True), StopReading.PERSON_STOP),
    (replace(DELEGATED_STOP, has_launch_failed=True), StopReading.LAUNCH_FAILURE),
    (replace(DELEGATED_STOP, is_resume_limit_reached=True), StopReading.RESUME_LIMIT),
    (replace(DELEGATED_STOP, is_program_ready=False), StopReading.RESUMED_PROGRAM_STARTING),
    (DELEGATED_STOP, StopReading.RESUMED),
    (replace(DELEGATED_STOP, is_delegated=False), StopReading.STOPPED),
    (replace(DELEGATED_STOP, has_requested_help=True, is_resume_limit_reached=True), StopReading.STOPPED),
])
def test_a_stop_with_tasks_left_has_one_reading(facts, reading):
    assert StopReading.from_facts(facts) is reading


@pytest.mark.parametrize("reading, shows_card, target", [
    (StopReading.WORK_UNDER_WAY, False, None),
    (StopReading.PERSON_STOP, True, None),
    (StopReading.LAUNCH_FAILURE, True, StopLineTarget.MAIN_AGENT),
    (StopReading.RESUME_LIMIT, True, StopLineTarget.MAIN_AGENT),
    (StopReading.RESUMED_PROGRAM_STARTING, True, StopLineTarget.MERGER),
    (StopReading.RESUMED, True, StopLineTarget.MERGER),
    (StopReading.STOPPED, True, StopLineTarget.MERGER),
])
def test_each_reading_says_whether_a_card_shows_and_who_gets_the_line(reading, shows_card, target):
    assert reading.shows_card is shows_card
    assert reading.line_target is target


def test_every_reading_with_a_card_and_no_person_behind_it_sends_one_line_to_somebody():
    silent = [reading for reading in StopReading if reading.shows_card and reading.line_target is None]
    assert silent == [StopReading.PERSON_STOP]


def test_only_the_two_resumed_readings_resume_the_worker():
    assert [reading for reading in StopReading if reading.resumes_worker] == [StopReading.RESUMED_PROGRAM_STARTING, StopReading.RESUMED]
