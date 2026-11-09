import json

from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.support.story_checks import expect_value

AUTO = "journal.suites.coding.auto-mode"
CONTINUE_SETTING = "journal.suites.coding.continue-while-delegatable"
MERGER = "journal.suites.coding.workers.merger-on"
REVISION_PREFIX = "revision: "


def revision(story, actor) -> str:
    shown = story.run("work-settings show --environment main", actor)
    lines = [line for line in shown.output_text.splitlines() if line.startswith(REVISION_PREFIX)]
    return lines[0].removeprefix(REVISION_PREFIX)


def test_s44_show_names_the_builder_preset_for_the_defaults(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_text("work-settings show --environment main", "workflow: builder", f"{AUTO}: on", actor=story.user)


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
    story.expect_refusal(f"work-settings apply --revision {revision(story, story.user)} --environment main {AUTO}=off journal.core.helpers.read-only-helper-run-limit=9", "not a work control", actor=story.user)
    story.expect_text("work-settings show --environment main", f"{AUTO}: on", f"{MERGER}: on", actor=story.user)


def test_s45_an_agent_cannot_apply_a_preset_or_a_change_and_nothing_changes(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_refusal(f"work-settings preset orchestrator --revision {revision(story, story.agent)} --environment main --reason 'a story asks'", "A person was asked", actor=story.agent)
    story.expect_refusal(f"work-settings apply --revision {revision(story, story.agent)} --environment main {AUTO}=off --reason 'a story asks'", "A person was asked", actor=story.agent)
    story.expect_text("work-settings show --environment main", "workflow: builder", actor=story.agent)


def test_the_work_settings_badge_the_context_size_as_the_capped_amount(new_story):
    story = new_story(fixture=UserBuilder)
    shown = json.loads(story.run("work-settings show --environment main --json", story.user).output_text)
    badges = {row["key"]: row["badge"] for row in shown["fields"]}
    expect_value(badges["journal.core.helpers.context-limit-tokens"], "Capped amount")
    expect_value(badges["journal.core.helpers.context-limit-on"], "")


def test_the_work_settings_name_the_settings_each_control_depends_on(new_story):
    story = new_story(fixture=UserBuilder)
    shown = json.loads(story.run("work-settings show --environment main --json", story.user).output_text)
    expect_value(shown["depends"][CONTINUE_SETTING], ["journal.suites.coding.main-writes-code"])
    expect_value(shown["depends"][MERGER], ["journal.suites.coding.workers.main-dispatches-workers"])
    expect_value("journal.suites.coding.auto-mode" not in shown["depends"], True)
