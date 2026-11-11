import pytest

from engine.setting.number_rule import NumberRule
from suites.coding.modules.workers.support.work_catalogue import EDITABLE_KEYS, QUESTION_KEYS, STOPPED_WORKER_KEYS
from suites.coding.modules.workers.support.worker_settings import (
    MERGER_ENABLED, MERGER_GROUP_MESSAGE_LIMIT, QUESTION_ANSWER_MINUTES, QUESTION_FORWARD_MINUTES, QUESTION_VISITS_LIMIT, SILENT_RECOVERY_ATTEMPTS,
    STOPPED_WORKER_RUN_MINUTES, WORKER_RESUME_LIMIT, WORKER_SETTING_RULES, WORKER_SETTING_VALUES)

KEYS = (QUESTION_ANSWER_MINUTES, QUESTION_FORWARD_MINUTES, QUESTION_VISITS_LIMIT, MERGER_GROUP_MESSAGE_LIMIT)
DEFAULTS = {"ask-answer-minutes": 10, "ask-pass-on-minutes": 30, "ask-visits-limit": 2, "most-merger-messages-per-group": 5}


@pytest.mark.parametrize("key", KEYS)
def test_every_number_of_the_questions_is_at_least_one_and_can_be_changed_on_the_workers_screen(key):
    assert WORKER_SETTING_RULES[key] == NumberRule(1)
    assert key in EDITABLE_KEYS and key in QUESTION_KEYS


@pytest.mark.parametrize("name, default", DEFAULTS.items())
def test_every_number_of_the_questions_is_set_by_a_person_and_needs_the_merger(name, default):
    declared = next(value for value in WORKER_SETTING_VALUES if value.key == name)
    assert declared.default == default and declared.person_set and list(declared.required_settings) == [MERGER_ENABLED]


STOPPED_WORKER_RULES = {SILENT_RECOVERY_ATTEMPTS: NumberRule(1), STOPPED_WORKER_RUN_MINUTES: NumberRule(1), WORKER_RESUME_LIMIT: NumberRule(0)}
STOPPED_WORKER_DEFAULTS = {"silent-recovery-attempts": 3, "stopped-worker-run-minutes": 30, "worker-resume-limit": 3}


@pytest.mark.parametrize("key, rule", STOPPED_WORKER_RULES.items())
def test_every_number_of_a_stopped_worker_has_its_lowest_value_and_can_be_changed_on_the_workers_screen(key, rule):
    assert WORKER_SETTING_RULES[key] == rule
    assert key in EDITABLE_KEYS and key in STOPPED_WORKER_KEYS


@pytest.mark.parametrize("name, default", STOPPED_WORKER_DEFAULTS.items())
def test_every_number_of_a_stopped_worker_is_set_by_a_person_with_or_without_the_merger(name, default):
    declared = next(value for value in WORKER_SETTING_VALUES if value.key == name)
    assert declared.default == default and declared.person_set and not declared.required_settings
