from dataclasses import replace
from types import SimpleNamespace

from engine.agent_stack.open_block import OpenBlock
from engine.agent_stack.reason import Reason
from engine.enums.command_category import CommandCategory
from engine.enums.decision_class import DecisionClass
from engine.enums.tool_type import ToolType
from engine.enums.work_stop import WorkStop
from engine.testing.agent_machine.question_samples import QuestionSamples
from engine.testing.agent_machine.view_samples import ViewSamples
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from suites.coding.modules.workers.nudges.context_hard_stop_nudge import ContextHardStopNudge
from suites.coding.modules.workers.policies.context_hard_limit_policy import ContextHardLimitPolicy

OVERVIEW_BLOCK = OpenBlock("overview.first", 3, Reason("overview.overview-first", DecisionClass.HOLD, "overview.first", "a sample hold line", ("journal overview",)),
                           True, False, True, False, True, None)
VIEW = replace(ViewSamples.view("main", WorkStop.REFUSE_WHILE_WORK_REMAINS, has_parent=False), blocks=(OVERVIEW_BLOCK,))


def policy(past_the_limit: bool = True) -> ContextHardLimitPolicy:
    return ContextHardLimitPolicy(SimpleNamespace(exceeds_hard_limit=lambda agent_id: past_the_limit), SimpleNamespace(is_watch_event=lambda event: False))


def journal_line(*arguments: str):
    return QuestionSamples.question(HookSamples.shell(" ".join(["journal", *arguments]), ShellPart("journal", CommandCategory.JOURNAL, list(arguments))))


def test_past_the_second_limit_an_edit_is_refused_in_todays_words():
    assert [reason.text for reason in policy().refusals(QuestionSamples.question(HookSamples.edit("a.py")), VIEW)] == [ContextHardStopNudge.declared().nudge().text]


def test_the_lifting_line_of_an_open_block_and_a_read_still_run():
    assert policy().refusals(journal_line("overview"), VIEW) == []
    assert policy().refusals(QuestionSamples.question(HookSamples.tool_use("Read", ToolType.READ, ["a.py"], None)), VIEW) == []


def test_under_the_limit_nothing_is_refused():
    assert policy(past_the_limit=False).refusals(QuestionSamples.question(HookSamples.edit("a.py")), VIEW) == []
