from tests.stories.core.support.agent_labels import agent_number
import json
import shlex

from engine.enums.setting_scope import SettingScope
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
from suites.coding.modules.workers.support.worker_settings import DISPATCHES_WORKERS_SETTING
from suites.coding.support.coding_settings import AUTO_MODE_SETTING
from suites.coding.support.coding_settings import STARTS_HELPERS_SETTING
from suites.coding.support.shipped_profiles import DESIGNER_PROFILE
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_PROFILE

NEW_KEYS = ["continue-while-delegatable", "designer-enabled", "main-agent-may-merge", "resume-silent-agents", "workers-start-read-only-helpers", "agent-options"]
REMOVED_CONTROLS = ["C04", "C08", "C15", "C19", "C32", "C33"]
REMOVED_KEYS = {"main-builds-tasks", "work-preference", "provider-choice", "fallback"}


def tree_rows(story) -> dict[str, dict]:
    return {row["key"]: row for row in json.loads(story.run("setting tree --json --environment main", actor=story.user).output_text)["rows"]}


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
            story.expect_refusal(f"setting set {key} {shlex.quote(saved_text(value))} {scope} --reason 'a story asks'", "A user was asked", actor=story.agent)


def test_s45_fixture_actors_are_distinct_agents_that_are_all_refused_a_person_only_setting(new_story):
    story = new_story(fixture=MainControlsActors)
    actors = agent_actors(story)
    expect_value((len({actor.id for actor in actors.values()}), list(actors)), (5, ["main", "worker", "helper", "merger", "designer"]))
    story.expect_text(f"agent show {agent_number(story, actors['merger'].id)}", f"{MERGER_PROFILE.name}", actor=story.user)
    story.expect_text(f"agent show {agent_number(story, actors['designer'].id)}", f"{DESIGNER_PROFILE.name}", actor=story.user)
    for role, actor in actors.items():
        story.expect_refusal(f"setting set {AUTO_MODE_SETTING} off --environment main --reason 'a story asks'", "A user was asked" if role == "main" else "may not run setting set", actor=actor)
    story.expect_success(f"setting show {AUTO_MODE_SETTING} --environment main", "value: True", actor=story.user)


def test_s48_defaults_a_running_worker_keeps_reporting_after_new_sessions_and_providers_are_switched_off(split_story, split_viewer):
    worker = dispatch(split_story)
    options = json.dumps(["worker allow_new=off", "worker allow_resume=off", "worker allowed_providers="])
    split_viewer.value("settings.settings", ["setting", "set", AGENT_OPTIONS, options, "--environment", "main"])
    split_story.expect_success("worker status", actor=worker)
    split_story.expect_text("task show 1", "state: started", actor=worker)
