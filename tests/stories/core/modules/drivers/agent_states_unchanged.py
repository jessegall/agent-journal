from engine.enums.command_category import CommandCategory
from engine.module.driver_entries import DRIVERS_MODULE
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from core.modules.drivers.models.hook_call import HookCall
from core.modules.plans.states.plan_focus_due import PlanFocusDue
from tests.stories.core.support.coding_fixtures import BuilderStartedWithoutPlainWords

FOCUS_RULE = "plans.focus-lines"
FOCUS_STATE = "plans.focus-due"
UNREAD_RULE = "messages.unread-write"
GUARD = "journal.core.settings.guard."
LISTING = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, [])).with_fields(event="post_tool_use")
PLAN_START = HookSamples.shell("journal plan start 1", ShellPart("journal", CommandCategory.JOURNAL, ["plan", "start", "1"], subcommand="plan")).with_fields(event="post_tool_use")


def records(story, sample) -> dict[str, dict]:
    reply = story.hook("s-1", sample)
    rows = story.container.get(Queries).query(HookCall).find(reply.hook_call_id).metadata.module_part(DRIVERS_MODULE)["rules"]
    return {row["rule"]: row for row in rows}


def switch_off(story, name: str) -> None:
    story.expect_success(f"setting make {GUARD}{name} false")


def test_a_rule_whose_state_is_closed_is_recorded_allowed_with_the_reason_and_no_time_in_its_place(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    rows = records(story, LISTING)
    gated = {name: (row["outcome"], row["reason"], row.get("milliseconds", 0)) for name, row in rows.items() if name in (FOCUS_RULE, UNREAD_RULE)}
    story.expect_rows(gated == {FOCUS_RULE: ("allowed", f"{FOCUS_STATE} is not open", 0), UNREAD_RULE: ("allowed", "messages.unread is not open", 0)}, detail=str(rows))


def test_a_plan_start_opens_the_focus_state_so_its_rule_is_asked_and_not_recorded_as_gated(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    rows = records(story, PLAN_START)
    story.expect_rows(FOCUS_RULE in rows, "is not open" not in rows[FOCUS_RULE].get("reason", ""), detail=str(rows))


def test_a_rule_switched_off_stays_off_though_its_state_is_open(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    switch_off(story, FOCUS_RULE)
    story.expect_rows(FOCUS_RULE not in records(story, PLAN_START))


def test_with_the_switch_of_the_state_off_its_rule_is_asked_on_every_hook_again(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    switch_off(story, FOCUS_STATE)
    rows = records(story, LISTING)
    story.expect_rows(FOCUS_RULE in rows, "is not open" not in rows[FOCUS_RULE].get("reason", ""), detail=str(rows))


def test_an_opener_that_raises_leaves_its_rule_asked_and_the_hook_answered(new_story, monkeypatch):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)

    def broken(state, hook):
        raise RuntimeError("the opener broke")

    monkeypatch.setattr(PlanFocusDue, "open_rows", broken)
    rows = records(story, LISTING)
    story.expect_rows(FOCUS_RULE in rows, "is not open" not in rows[FOCUS_RULE].get("reason", ""), detail=str(rows))
