from dataclasses import replace

from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.stepping.agent_machine import AgentMachine
from engine.enums.decision_class import DecisionClass
from engine.enums.work_stop import WorkStop
from engine.testing.agent_machine.question_samples import QuestionSamples
from engine.testing.agent_machine.view_samples import ViewSamples
from engine.testing.examples.hook_samples import HookSamples
from core.modules.overview.lines.overview_first_lines import OverviewFirstLines
from core.modules.overview.needs.overview_first_needs import OVERVIEW_RULE, OverviewFirstNeeds
from core.modules.overview.nudges.overview_line_nudge import OverviewLineNudge
from core.modules.overview.support.overview_first import OverviewFirst

MAIN = AgentReference(4, None, 1, "main")
START = QuestionSamples.question(HookSamples.session_start())
RESUME = QuestionSamples.question(HookSamples.session_start().with_raw({"source": "resume"}))
EDIT = QuestionSamples.question(HookSamples.edit("a.py"))
VIEW = ViewSamples.view("main", WorkStop.REFUSE_WHILE_WORK_REMAINS, has_parent=False)


def test_a_session_start_plans_the_strict_overview_block_and_a_resume_does_not() -> None:
    needs = OverviewFirstNeeds(OverviewFirst())
    plan = needs.needs([MAIN], START)[4][0]
    assert (plan.tool_check_key, plan.is_strict, plan.lifting_lines) == (OVERVIEW_RULE, True, ("journal overview",))
    assert needs.needs([MAIN], RESUME) == {}


def test_the_planned_block_refuses_an_edit_until_the_overview_runs() -> None:
    plan = OverviewFirstNeeds(OverviewFirst()).needs([MAIN], START)[4][0]
    assert AgentMachine().step(replace(VIEW, plans=(plan,)), EDIT).record.decision.decision_class is DecisionClass.HOLD


def test_a_session_start_tells_the_agent_to_run_the_overview_in_todays_words() -> None:
    lines = OverviewFirstLines(OverviewFirst())
    assert [line.text for line in lines.lines(START, VIEW)] == [OverviewLineNudge.declared().nudge().text]
    assert lines.lines(RESUME, VIEW) == []
