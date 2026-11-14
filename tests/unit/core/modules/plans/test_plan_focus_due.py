from types import SimpleNamespace

from engine.driver.agent_state import StateTier
from engine.driver.rule_answer import RuleAnswer
from core.modules.plans.rules.plan_focus_rule import PlanFocusRule
from core.modules.plans.states.plan_focus_due import PLAN_START_TABLE, PlanFocusDue
from core.modules.plans.support.focus.new_focus_places import NewFocusPlaces
from tests.unit.core.modules.plans.rules.test_plan_focus_rule import AGENT_ID, hook, rule


def state_of(focus_rule: PlanFocusRule) -> PlanFocusDue:
    return PlanFocusDue(focus_rule.new_places)


def test_the_state_is_asked_in_place_and_gates_the_focus_rule():
    assert (PlanFocusDue.name, PlanFocusDue.tier, PlanFocusDue.rules) == ("plans.focus-due", StateTier.IN_PLACE, [PlanFocusRule])


def test_with_no_new_place_and_no_plan_start_the_state_is_closed_and_the_rule_answers_allowed_and_judges_nothing():
    focus_rule = rule(started=[])
    assert state_of(focus_rule).open_rows(hook()) == []
    assert focus_rule.answer(hook()) == RuleAnswer.allowed()
    assert focus_rule.judged.judged == {}


def test_a_plan_start_in_the_shell_line_opens_the_state():
    rows = state_of(rule()).open_rows(hook(line_numbers=[2]))
    assert [row.table for row in rows] == [PLAN_START_TABLE]


def test_a_task_started_since_the_last_answer_opens_the_state_with_its_place():
    rows = state_of(rule(started=[(11, 5)])).open_rows(hook())
    assert [(row.table, row.row_id) for row in rows] == [("task", 11)]
