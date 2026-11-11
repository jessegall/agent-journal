from dataclasses import replace

import pytest

from suites.coding.modules.workers.models.enums.stop_line_target import StopLineTarget
from suites.coding.modules.workers.models.enums.stop_reading import StopReading
from suites.coding.modules.workers.support.stop_facts import StopFacts

DELEGATED_STOP = StopFacts(is_busy=False, is_person_stop=False, has_launch_failed=False, is_delegated=True, is_resume_limit_reached=False,
                           has_requested_help=False, is_program_ready=True, task_names="task:1")


@pytest.mark.parametrize("facts, expected", [
    (replace(DELEGATED_STOP, is_busy=True), StopReading.BUSY),
    (replace(DELEGATED_STOP, is_person_stop=True, is_busy=True), StopReading.PERSON_STOP),
    (replace(DELEGATED_STOP, has_launch_failed=True), StopReading.LAUNCH_FAILURE),
    (replace(DELEGATED_STOP, is_resume_limit_reached=True), StopReading.RESUME_LIMIT),
    (replace(DELEGATED_STOP, is_program_ready=False), StopReading.RESUMED_PROGRAM_STARTING),
    (DELEGATED_STOP, StopReading.RESUMED),
    (replace(DELEGATED_STOP, is_delegated=False), StopReading.STOPPED),
    (replace(DELEGATED_STOP, has_requested_help=True, is_resume_limit_reached=True), StopReading.STOPPED),
])
def test_a_stop_with_tasks_left_has_one_reading(facts, expected):
    assert facts.reading() is expected


@pytest.mark.parametrize("stop, shows_card, target", [
    (StopReading.BUSY, False, None),
    (StopReading.PERSON_STOP, True, None),
    (StopReading.LAUNCH_FAILURE, True, StopLineTarget.MAIN_AGENT),
    (StopReading.RESUME_LIMIT, True, StopLineTarget.MAIN_AGENT),
    (StopReading.RESUMED_PROGRAM_STARTING, True, StopLineTarget.MERGER),
    (StopReading.RESUMED, True, StopLineTarget.MERGER),
    (StopReading.STOPPED, True, StopLineTarget.MERGER),
])
def test_each_stop_says_whether_a_card_shows_and_who_gets_the_line(stop, shows_card, target):
    assert stop.shows_card is shows_card
    assert stop.line_target is target


def test_every_stop_with_a_card_and_no_person_behind_it_sends_one_line_to_somebody():
    assert [stop for stop in StopReading if stop.shows_card and stop.line_target is None] == [StopReading.PERSON_STOP]


def test_only_the_two_resumed_stops_resume_the_worker():
    assert [stop for stop in StopReading if stop.resumes_worker] == [StopReading.RESUMED_PROGRAM_STARTING, StopReading.RESUMED]
