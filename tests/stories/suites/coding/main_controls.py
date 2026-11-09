import json
import shlex

from core.base.setting.setting_scope import SettingScope
from core.modules.helpers.support.agent_field_options import AgentFieldOptions
from core.modules.helpers.support.agent_options_value import AgentOptionsValue
from core.modules.helpers.support.helper_settings import AGENT_OPTIONS
from suites.coding.modules.workers.support.worker_settings import MERGE_COMMANDS, TEST_COMMAND_PAIR
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.suites.coding.support.main_controls_fixture import MainControlsActors, agent_actors
from tests.stories.suites.coding.support.main_controls_contract import (AGENT_TYPES, CONTROLS, DECLARED, MAIN_AUTO_DESCRIPTION, RULES, SETTING_PARTS,
                                                                         malformed_value_problems, matrix_cases, option_problems, owner_problems, saved_text)
from tests.stories.suites.coding.modules.workers.support.program_split import dispatch, split_story, split_viewer
from tests.stories.support.story_checks import expect_absent_value, expect_value

NEW_KEYS = ["continue-while-delegatable", "designer-enabled", "main-agent-may-merge", "resume-silent-agents", "workers-start-read-only-helpers", "agent-options"]
REMOVED_CONTROLS = ["C04", "C08", "C15", "C19"]
REMOVED_KEYS = {"main-builds-tasks", "work-preference", "provider-choice", "fallback"}


def tree_rows(story) -> dict[str, dict]:
    return {row["key"]: row for row in json.loads(story.run("setting tree --json --environment main", actor=story.user).output_text)["rows"]}


def test_s01_s43_defaults_cover_39_controls_and_leave_out_the_removed_ones():
    numbers = [control.number for control in CONTROLS]
    expect_value((len(numbers), len(set(numbers)), set(numbers) & set(REMOVED_CONTROLS)), (39, 39, set()))


def test_s01_s43_defaults_have_one_declared_owner_and_are_person_only():
    expect_absent_value(owner_problems())


def test_s01_s43_defaults_of_the_agent_options_are_declared_once_and_person_only():
    declared = [DECLARED[AGENT_OPTIONS]]
    expect_value([(owner, value.person_set, value.default) for owner, value in declared], [("helpers", True, ())])
    expect_absent_value(option_problems())


def test_s01_s43_defaults_keep_the_existing_keys_and_scopes_with_neutral_labels():
    auto = DECLARED["journal.suites.coding.auto-mode"][1]
    helpers = DECLARED["journal.suites.coding.main-starts-read-only-helpers"][1]
    dispatches = DECLARED["journal.suites.coding.workers.main-dispatches-workers"][1]
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
    expect_value(inherited.effective_options("worker", "journal-worker").allowed_providers, None)
    expect_value(denied.effective_options("worker", "journal-worker").allowed_providers, ())


def test_s44_s50_defaults_let_a_profile_line_win_over_its_agent_type_for_the_fields_it_names():
    value = AgentOptionsValue.parse(["helper allow_new=off", "helper allow_resume=off", "helper:journal-merger allow_new=on"], AGENT_TYPES)
    merger = value.effective_options("helper", "journal-merger")
    expect_value((merger.allow_new, merger.allow_resume), (True, False))
    expect_value(value.effective_options("helper", "journal-researcher").allow_new, False)
    expect_value(AgentOptionsValue.parse([], AGENT_TYPES).effective_options("worker", "journal-worker"), AgentFieldOptions())


def test_s01_s43_defaults_show_in_the_settings_tree_for_every_control(new_story):
    story = new_story(fixture=UserBuilder)
    rows = tree_rows(story)
    unshown = [part.key for _, part in SETTING_PARTS if part.key not in rows or rows[part.key]["value"] != rows[part.key]["default"]]
    missing = [key for key in NEW_KEYS if not any(shown.endswith(f".{key}") for shown in rows)]
    expect_absent_value(unshown + missing)


def test_s45_defaults_cannot_be_set_by_an_agent(new_story):
    story = new_story(fixture=UserBuilder)
    for key, (owner, value) in DECLARED.items():
        if value.person_set:
            scope = "--project" if value.scope is SettingScope.PROJECT else "--environment main"
            story.expect_refusal(f"setting set {key} {shlex.quote(saved_text(value))} {scope} --reason 'a story asks'", "A person was asked", actor=story.agent)


def test_s01_s52_fixture_matrix_names_78_control_cases_8_regressions_and_the_transitions():
    cases = matrix_cases()
    expect_value((len(cases), len(set(cases)), sum(case.startswith("C") for case in cases)), (104, 104, 78))


def test_s45_fixture_actors_are_distinct_agents_that_are_all_refused_a_person_only_setting(new_story):
    story = new_story(fixture=MainControlsActors)
    actors = agent_actors(story)
    expect_value((len({actor.id for actor in actors.values()}), list(actors)), (5, ["main", "worker", "helper", "merger", "designer"]))
    story.expect_text(f"agent show {actors['merger'].id}", "journal-merger", actor=story.user)
    story.expect_text(f"agent show {actors['designer'].id}", "journal-designer", actor=story.user)
    for actor in actors.values():
        story.expect_refusal("setting set journal.suites.coding.auto-mode off --environment main --reason 'a story asks'", "A person was asked", actor=actor)
    story.expect_success("setting show journal.suites.coding.auto-mode --environment main", "value: True", actor=story.user)


def test_s48_defaults_a_running_worker_keeps_reporting_after_new_sessions_and_providers_are_switched_off(split_story, split_viewer):
    worker = dispatch(split_story)
    options = json.dumps(["worker allow_new=off", "worker allow_resume=off", "worker allowed_providers="])
    split_viewer.value("settings.settings", ["setting", "set", AGENT_OPTIONS, options, "--environment", "main"])
    split_story.expect_success("worker status", actor=worker)
    split_story.expect_text("task show 1", "state: started", actor=worker)
