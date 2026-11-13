import pytest

from engine.setting.number_rule import NumberRule
from suites.coding.modules.workers.support.work_catalogue import EDITABLE_KEYS, UP_TO_DATE_KEYS
from suites.coding.modules.workers.support.worker_settings import (
    BEHIND_CHECK_MINUTES, BEHIND_COMMITS_TO_CHECK, BEHIND_RECHECK_COMMITS, KEEP_UP_TO_DATE, UP_TO_DATE_SECTION, UPDATE_REMINDERS, UPDATE_TO_MAIN_COMMITS,
    UPDATE_WAIT_MINUTES, WORKER_SETTING_RULES, WORKER_SETTING_VALUES)

RULES = {BEHIND_COMMITS_TO_CHECK: NumberRule(0), BEHIND_CHECK_MINUTES: NumberRule(1), BEHIND_RECHECK_COMMITS: NumberRule(0), UPDATE_TO_MAIN_COMMITS: NumberRule(0),
         UPDATE_WAIT_MINUTES: NumberRule(1), UPDATE_REMINDERS: NumberRule(0)}


def declared(key: str):
    return next(value for value in WORKER_SETTING_VALUES if key.endswith(f".{value.key}"))


@pytest.mark.parametrize("key", (KEEP_UP_TO_DATE, *RULES))
def test_each_setting_of_keeping_worktrees_up_to_date_is_set_by_a_person_in_its_section(key):
    value = declared(key)
    assert (value.person_set, value.section) == (True, UP_TO_DATE_SECTION)


@pytest.mark.parametrize("key, rule", RULES.items())
def test_each_number_refuses_a_value_below_its_least_and_the_switch_comes_first(key, rule):
    assert WORKER_SETTING_RULES[key] == rule and key in EDITABLE_KEYS
    assert UP_TO_DATE_KEYS[0] == KEEP_UP_TO_DATE


def test_the_numbers_need_the_switch_on():
    assert all(list(declared(key).required_settings) == [KEEP_UP_TO_DATE] for key in RULES)
