import json

from core.modules.helpers.support.agent_field_options import AgentFieldOptions
from core.modules.helpers.support.agent_options_value import AgentOptionsValue
from core.modules.helpers.support.helper_settings import AGENT_OPTIONS
from engine.enums.setting_scope import SettingScope
from suites.coding.modules.workers.support.worker_settings import DISPATCHES_WORKERS_SETTING
from suites.coding.modules.workers.support.worker_settings import TEST_COMMAND_PAIR
from suites.coding.support.coding_settings import AUTO_MODE_SETTING
from suites.coding.support.coding_settings import STARTS_HELPERS_SETTING
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_PROFILE
from tests.stories.suites.coding.support.main_controls_contract import (AGENT_TYPES, CONTROLS, DECLARED, MAIN_AUTO_DESCRIPTION, malformed_value_problems, matrix_cases,
                                                                         option_problems, owner_problems)
from tests.stories.support.story_checks import expect_absent_value, expect_value

NEW_KEYS = ["continue-while-delegatable", "designer-enabled", "main-agent-may-merge", "resume-silent-agents", "workers-start-read-only-helpers", "agent-options"]
REMOVED_CONTROLS = ["C04", "C08", "C15", "C19", "C32", "C33"]
REMOVED_KEYS = {"main-builds-tasks", "work-preference", "provider-choice", "fallback"}


def tree_rows(story) -> dict[str, dict]:
    return {row["key"]: row for row in json.loads(story.run("setting tree --json --environment main", actor=story.user).output_text)["rows"]}


def test_s01_s43_defaults_cover_37_controls_and_leave_out_the_removed_ones():
    numbers = [control.number for control in CONTROLS]
    expect_value((len(numbers), len(set(numbers)), set(numbers) & set(REMOVED_CONTROLS)), (37, 37, set()))


def test_s01_s43_defaults_have_one_declared_owner_and_are_person_only():
    expect_absent_value(owner_problems())


def test_s01_s43_defaults_of_the_agent_options_are_declared_once_and_person_only():
    declared = [DECLARED[AGENT_OPTIONS]]
    expect_value([(owner, value.person_set, value.default) for owner, value in declared], [("helpers", True, ())])
    expect_absent_value(option_problems())


def test_s01_s43_defaults_keep_the_existing_keys_and_scopes_with_neutral_labels():
    auto = DECLARED[f"{AUTO_MODE_SETTING}"][1]
    helpers = DECLARED[f"{STARTS_HELPERS_SETTING}"][1]
    dispatches = DECLARED[f"{DISPATCHES_WORKERS_SETTING}"][1]
    expect_value((auto.description, auto.scope, auto.default), (MAIN_AUTO_DESCRIPTION, SettingScope.ENVIRONMENT, True))
    expect_value((helpers.title, helpers.scope), ("Use read-only helpers", SettingScope.PROJECT))
    expect_value((dispatches.title, dispatches.scope), ("Main agent sends workers", SettingScope.LAYERED))
    expect_value({key.rsplit(".", 1)[-1] for key in DECLARED} & REMOVED_KEYS, set())


def test_s01_s43_defaults_reject_malformed_values():
    expect_absent_value(malformed_value_problems())


def test_s01_s43_defaults_reject_one_test_command_without_the_other():
    pairs = [("", ""), ("find-tests", "run-tests"), ("find-tests", ""), ("", "run-tests")]
    expect_value([bool(list(TEST_COMMAND_PAIR.problems(first, second))) for first, second in pairs], [False, False, True, True])


def test_s01_s43_defaults_tell_an_inherited_list_from_an_explicit_empty_one():
    inherited = AgentOptionsValue.parse(["worker allow_new=off"], AGENT_TYPES)
    denied = AgentOptionsValue.parse(["worker allowed_providers="], AGENT_TYPES)
    expect_value(inherited.effective_options("worker", f"{WORKER_PROFILE.name}").allowed_providers, None)
    expect_value(denied.effective_options("worker", f"{WORKER_PROFILE.name}").allowed_providers, ())


def test_s44_s50_defaults_let_a_profile_line_win_over_its_agent_type_for_the_fields_it_names():
    value = AgentOptionsValue.parse(["helper allow_new=off", "helper allow_resume=off", f"helper:{MERGER_PROFILE.name} allow_new=on"], AGENT_TYPES)
    merger = value.effective_options("helper", f"{MERGER_PROFILE.name}")
    expect_value((merger.allow_new, merger.allow_resume), (True, False))
    expect_value(value.effective_options("helper", f"{RESEARCHER_PROFILE.name}").allow_new, False)
    expect_value(AgentOptionsValue.parse([], AGENT_TYPES).effective_options("worker", f"{WORKER_PROFILE.name}"), AgentFieldOptions())


def test_s01_s52_fixture_matrix_names_74_control_cases_8_regressions_and_the_transitions():
    cases = matrix_cases()
    expect_value((len(cases), len(set(cases)), sum(case.startswith("C") for case in cases)), (100, 100, 74))


