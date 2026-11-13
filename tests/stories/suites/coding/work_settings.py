import json

from suites.coding.support.main_options import BUILDER, ORCHESTRATOR
from tests.stories.core.support.coding_fixtures import UserBuilder
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from suites.coding.support.coding_settings import AUTO_MODE_SETTING
from suites.coding.support.coding_settings import KEEP_RUNNING_SETTING
from core.modules.helpers.support.helper_settings import HELPER_RUN_LIMIT
from tests.stories.support.story_checks import expect_value, expect_value_4

AUTO = f"{AUTO_MODE_SETTING}"
CONTINUE_SETTING = f"{KEEP_RUNNING_SETTING}"
MERGER = f"{MERGER_ENABLED}"
REVISION_PREFIX = "revision: "


def revision(story, actor) -> str:
    shown = story.run("work-settings show --environment main", actor)
    lines = [line for line in shown.output_text.splitlines() if line.startswith(REVISION_PREFIX)]
    return lines[0].removeprefix(REVISION_PREFIX)


def test_s44_the_orchestrator_preset_writes_its_controls_together_and_the_builder_preset_restores_the_name(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"work-settings preset orchestrator --revision {revision(story, story.user)} --environment main", actor=story.user)
    story.expect_text("work-settings show --environment main", "workflow: orchestrator", f"{AUTO}: off", f"{CONTINUE_SETTING}: on", actor=story.user)
    story.expect_success(f"work-settings preset builder --revision {revision(story, story.user)} --environment main", actor=story.user)
    story.expect_text("work-settings show --environment main", "workflow: builder", f"{AUTO}: on", actor=story.user)


def test_s44_changing_one_owned_control_derives_custom_and_putting_it_back_restores_the_preset(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"work-settings apply --revision {revision(story, story.user)} --environment main {MERGER}=off", actor=story.user)
    story.expect_text("work-settings show --environment main", "workflow: custom", actor=story.user)
    story.expect_success(f"work-settings apply --revision {revision(story, story.user)} --environment main {MERGER}=on", actor=story.user)
    story.expect_text("work-settings show --environment main", "workflow: builder", actor=story.user)


def test_s51_a_stale_draft_is_refused_and_changes_no_row(new_story):
    story = new_story(fixture=UserBuilder)
    stale = revision(story, story.user)
    story.expect_success(f"setting set {CONTINUE_SETTING} on --environment main", actor=story.user)
    story.expect_refusal(f"work-settings apply --revision {stale} --environment main {AUTO}=off {MERGER}=off", "changed since", actor=story.user)
    story.expect_text("work-settings show --environment main", f"{AUTO}: on", f"{MERGER}: on", actor=story.user)


def test_s54_one_invalid_value_in_an_apply_changes_none_of_the_controls(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_refusal(f"work-settings apply --revision {revision(story, story.user)} --environment main {AUTO}=off {MERGER}=maybe", "not 'maybe'", actor=story.user)
    story.expect_refusal(f"work-settings apply --revision {revision(story, story.user)} --environment main {AUTO}=off {HELPER_RUN_LIMIT}=9", "not a work control", actor=story.user)
    story.expect_text("work-settings show --environment main", f"{AUTO}: on", f"{MERGER}: on", actor=story.user)


def test_s45_an_agent_cannot_apply_a_preset_or_a_change_and_nothing_changes(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_refusal(f"work-settings preset orchestrator --revision {revision(story, story.agent)} --environment main --reason 'a story asks'", "A user was asked", actor=story.agent)
    story.expect_refusal(f"work-settings apply --revision {revision(story, story.agent)} --environment main {AUTO}=off --reason 'a story asks'", "A user was asked", actor=story.agent)
    story.expect_text("work-settings show --environment main", "workflow: builder", actor=story.agent)


def shown_fields(story) -> dict[str, dict[str, object]]:
    shown = json.loads(story.run("work-settings show --environment main --json", story.user).output_text)
    return {row["key"]: row for row in shown["fields"]}


def test_the_work_settings_read_carries_the_presets_with_the_value_each_gives_each_control(new_story):
    story = new_story(fixture=UserBuilder)
    shown = json.loads(story.run("work-settings show --environment main --json", story.user).output_text)
    presets = {preset["key"]: preset for preset in shown["presets"]}
    expect_value(list(presets), ["builder", "orchestrator"])
    expect_value([preset["name"] for preset in presets.values()], ["Builder", "Orchestrator"])
    expect_value_4(all(preset["line"] for preset in presets.values()))
    expect_value(sorted(presets["builder"]["values"].values()), sorted(BUILDER))
    expect_value(sorted(presets["orchestrator"]["values"].values()), sorted(ORCHESTRATOR))
    expect_value(set(presets["builder"]["values"]), {switch["key"] for switch in shown["switches"]})
    expect_value_4(all(switch["title"] for switch in shown["switches"]))
    expect_value_4(shown_fields(story))
