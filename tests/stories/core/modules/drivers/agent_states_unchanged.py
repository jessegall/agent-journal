from engine.enums.command_category import CommandCategory
from engine.module.driver_entries import DRIVERS_MODULE
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from core.modules.drivers.models.hook_call import HookCall
from core.modules.plans.rules.plan_focus_rule import PlanFocusRule
from core.modules.plans.states.plan_focus_due import PlanFocusDue
from tests.stories.core.support.coding_fixtures import BuilderStartedWithoutPlainWords

FOCUS_RULE = "plans.focus-lines"
FOCUS_STATE = "plans.focus-due"
GUARD = "journal.core.settings.guard."
LISTING = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, [])).with_fields(event="post_tool_use")
PLAN_START = HookSamples.shell("journal plan start 1", ShellPart("journal", CommandCategory.JOURNAL, ["plan", "start", "1"], subcommand="plan")).with_fields(event="post_tool_use")


class Calls:
    """How often the focus state's opener ran and the focus rule was asked, counted while hooks run."""

    def __init__(self, monkeypatch) -> None:
        self.opened, self.asked = 0, 0
        opener, rule = PlanFocusDue.open_rows, PlanFocusRule.answer

        def counted_opener(state, hook):
            self.opened += 1
            return opener(state, hook)

        def counted_answer(focus_rule, hook):
            self.asked += 1
            return rule(focus_rule, hook)

        monkeypatch.setattr(PlanFocusDue, "open_rows", counted_opener)
        monkeypatch.setattr(PlanFocusRule, "answer", counted_answer)


def recorded(story, sample) -> dict[str, dict]:
    reply = story.hook("s-1", sample)
    rows = story.container.get(Queries).query(HookCall).find(reply.hook_call_id).metadata.module_part(DRIVERS_MODULE)["rules"]
    return {row["rule"]: row for row in rows}


def switch_off(story, name: str) -> None:
    story.use_fixture_environment(None)
    story.expect_success(f"setting make {GUARD}{name} false")


def test_a_rule_whose_state_is_closed_is_recorded_allowed_in_its_place_without_being_asked(new_story, monkeypatch):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    calls = Calls(monkeypatch)
    rows = recorded(story, LISTING)
    story.expect_rows(rows[FOCUS_RULE]["outcome"] == "allowed", "milliseconds" not in rows[FOCUS_RULE], (calls.opened, calls.asked) == (1, 0), detail=f"{calls.opened}, {calls.asked}, {rows}")


def test_a_plan_start_opens_the_focus_state_so_its_rule_is_asked(new_story, monkeypatch):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    calls = Calls(monkeypatch)
    rows = recorded(story, PLAN_START)
    story.expect_rows(FOCUS_RULE in rows, (calls.opened, calls.asked) == (1, 1), detail=f"{calls.opened}, {calls.asked}, {rows}")


def test_a_rule_switched_off_stays_off_though_its_state_is_open(new_story, monkeypatch):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    switch_off(story, FOCUS_RULE)
    calls = Calls(monkeypatch)
    rows = recorded(story, PLAN_START)
    story.expect_rows(FOCUS_RULE not in rows, calls.asked == 0, detail=f"{calls.asked}, {rows}")


def test_with_the_switch_of_the_state_off_its_rule_is_asked_on_every_hook_again(new_story, monkeypatch):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    switch_off(story, FOCUS_STATE)
    calls = Calls(monkeypatch)
    recorded(story, LISTING)
    story.expect_rows((calls.opened, calls.asked) == (0, 1), detail=f"{calls.opened}, {calls.asked}")


def test_an_opener_that_raises_leaves_its_rule_asked_and_the_hook_answered(new_story, monkeypatch):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    requested = []
    answer = PlanFocusRule.answer

    def broken(state, hook):
        raise RuntimeError("the opener broke")

    def counted_answer(focus_rule, hook):
        requested.append(hook.hook_name)
        return answer(focus_rule, hook)

    monkeypatch.setattr(PlanFocusDue, "open_rows", broken)
    monkeypatch.setattr(PlanFocusRule, "answer", counted_answer)
    story.hook("s-1", HookSamples.prompt("go on"))
    rows = recorded(story, LISTING)
    story.expect_rows(FOCUS_RULE in rows, len(requested) == 1, detail=f"{requested}, {rows}")
