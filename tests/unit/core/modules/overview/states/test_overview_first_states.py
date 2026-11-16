from dataclasses import replace

from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.stepping.agent_state_machine import AgentStateMachine
from engine.enums.decision_class import DecisionClass
from engine.enums.work_stop import WorkStop
from engine.testing.agent_machine.question_samples import QuestionSamples
from engine.testing.agent_machine.view_samples import ViewSamples
from engine.testing.examples.hook_samples import HookSamples
from core.modules.overview.lines.overview_first_lines import OverviewFirstLines
from core.modules.overview.states.overview_first_states import OVERVIEW_KEY, OverviewFirstStates
from core.modules.overview.agent_messages.overview_line_message import OverviewLineMessage
from core.modules.overview.support.overview_first import OverviewFirst

MAIN = AgentReference(4, None, 1, "main")
START = QuestionSamples.question(HookSamples.session_start())
RESUME = QuestionSamples.question(HookSamples.session_start().with_raw({"source": "resume"}))
EDIT = QuestionSamples.question(HookSamples.edit("a.py"))
VIEW = ViewSamples.view("main", WorkStop.REFUSE_DURING_WORK, has_parent=False)


def test_a_session_start_plans_the_strict_overview_block_and_a_resume_does_not() -> None:
    states = OverviewFirstStates(OverviewFirst())
    plan = states.states([MAIN], START)[4][0]
    assert (plan.tool_check_key, plan.is_strict, plan.lifting_lines) == (OVERVIEW_KEY, True, ("journal overview",))
    assert states.states([MAIN], RESUME) == {}


def test_the_planned_block_refuses_an_edit_until_the_overview_runs() -> None:
    plan = OverviewFirstStates(OverviewFirst()).states([MAIN], START)[4][0]
    assert AgentStateMachine().step(replace(VIEW, plans=(plan,)), EDIT).record.decision.decision_class is DecisionClass.HOLD


def test_a_session_start_tells_the_agent_to_run_the_overview_in_todays_words() -> None:
    lines = OverviewFirstLines(OverviewFirst())
    assert [line.text for line in lines.lines(START, VIEW)] == [OverviewLineMessage.declared().agent_message().text]
    assert lines.lines(RESUME, VIEW) == []
