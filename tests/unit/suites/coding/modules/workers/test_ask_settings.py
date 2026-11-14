import pytest

from engine.setting.number_rule import NumberRule
from suites.coding.modules.workers.support.work_catalogue import EDITABLE_KEYS, QUESTION_KEYS, STOPPED_WORKER_KEYS
from core.modules.asks.support.ask_settings import ASK_ANSWER_MINUTES, ASK_PASS_ON_MINUTES, ASK_SETTINGS, ASK_VISITS_LIMIT, ASKS_SCREEN
from suites.coding.modules.workers.support.worker_settings import (
    MERGER_ENABLED, MERGER_GROUP_MESSAGE_LIMIT, SILENT_RECOVERY_ATTEMPTS,
    STOPPED_WORKER_RUN_MINUTES, WORKER_RESUME_LIMIT, WORKER_SETTING_RULES, WORKER_SETTING_VALUES)

KEYS = (ASK_ANSWER_MINUTES, ASK_PASS_ON_MINUTES, ASK_VISITS_LIMIT, MERGER_GROUP_MESSAGE_LIMIT)


def declared(key: str):
    return next(value for value in WORKER_SETTING_VALUES if key.endswith(f".{value.key}"))


@pytest.mark.parametrize("key", KEYS)
def test_every_number_of_the_questions_is_at_least_one_and_can_be_changed_on_the_workers_screen(key):
    assert WORKER_SETTING_RULES[key] == NumberRule(1)
    assert key in EDITABLE_KEYS and key in QUESTION_KEYS


def test_the_questions_per_commit_are_set_by_a_person_and_need_the_merger():
    value = declared(MERGER_GROUP_MESSAGE_LIMIT)
    assert value.person_set and list(value.required_settings) == [MERGER_ENABLED]


@pytest.mark.parametrize("value", ASK_SETTINGS)
def test_the_question_times_are_set_by_a_person_on_their_own_screen_with_the_merger_off(value):
    assert value.person_set and list(value.required_settings) == [] and value.screen == ASKS_SCREEN


STOPPED_WORKER_RULES = {SILENT_RECOVERY_ATTEMPTS: NumberRule(1), STOPPED_WORKER_RUN_MINUTES: NumberRule(1), WORKER_RESUME_LIMIT: NumberRule(0)}


@pytest.mark.parametrize("key, rule", STOPPED_WORKER_RULES.items())
def test_every_number_of_a_stopped_worker_has_its_lowest_value_and_can_be_changed_on_the_workers_screen(key, rule):
    assert WORKER_SETTING_RULES[key] == rule
    assert key in EDITABLE_KEYS and key in STOPPED_WORKER_KEYS


@pytest.mark.parametrize("key", STOPPED_WORKER_RULES)
def test_every_number_of_a_stopped_worker_is_set_by_a_person_with_or_without_the_merger(key):
    value = declared(key)
    assert value.person_set and not value.required_settings
