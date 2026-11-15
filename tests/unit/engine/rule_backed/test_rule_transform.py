from collections.abc import Sequence
from dataclasses import replace

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.capabilities import Capabilities
from engine.agent_machine.contracts.capability import Capability
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.needs.rank_order import RankOrder
from engine.agent_machine.contracts.shell_parser import ShellParser
from engine.agent_machine.record.question import Question
from engine.agent_stack.reason import Reason
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.driver.shell_line import ShellLine
from engine.enums.capability_part import CapabilityPart
from engine.enums.capability_proof import CapabilityProof
from engine.enums.command_category import CommandCategory
from engine.enums.command_effect import CommandEffect
from engine.enums.decision_class import DecisionClass
from engine.enums.hook_event_name import HookEventName
from engine.enums.transform_slot import TransformSlot
from engine.enums.work_stop import WorkStop
from engine.agent_machine.stepping.agent_machine import AgentMachine
from engine.rule_backed.rule_hooks import RuleHooks
from engine.rule_backed.rule_transform import RuleTransform
from engine.testing.agent_machine.question_samples import QuestionSamples
from engine.testing.agent_machine.view_samples import ViewSamples
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart

EDIT_LINE = "sed -i s/a/b/ a.py"
WRITE_LINE = "tee a.py"
PARSED = {
    EDIT_LINE: ShellPart("sed", CommandCategory.EDIT, ["-i", "s/a/b/", "a.py"], effects=[CommandEffect.WRITES_FILES]),
    WRITE_LINE: ShellPart("tee", CommandCategory.EDIT, ["a.py"], effects=[CommandEffect.WRITES_FILES]),
}


def shell_question(line: str, part: ShellPart) -> Question:
    return QuestionSamples.question(HookSamples.shell(line, part))


class SampleRewriteRule(DriverRule):
    name = "samples.rewrite"
    hook = HookEventName.PRE_TOOL_USE


class SampleParser(ShellParser):
    """The parts the hook client would send for each sample line."""

    def line(self, text: str) -> ShellLine:
        tool = shell_question(text, PARSED[text]).tool()
        assert tool is not None and tool.shell is not None
        return tool.shell


class SampleHooks(RuleHooks):
    def __init__(self, command: str) -> None:
        self.command = command

    def answer(self, rule: type[DriverRule], question: Question, agent_id: int) -> RuleAnswer | None:
        return RuleAnswer(updated_input={"command": self.command})


class SampleAliasTransform(RuleTransform):
    rule = SampleRewriteRule
    slot = TransformSlot.ALIAS


class SampleProjectHookTransform(RuleTransform):
    rule = SampleRewriteRule
    slot = TransformSlot.PROJECT_HOOK


class SampleRunnerTransform(RuleTransform):
    rule = SampleRewriteRule
    slot = TransformSlot.RUNNER
    replaces_action = False


class EditPolicy(Policy):
    key = "files.no-edit"
    rank = "files.policies"

    def refusals(self, question: Question, view: AgentView) -> Sequence[Reason]:
        tool = question.tool()
        return [Reason(self.key, DecisionClass.REFUSE, self.rank, "no edits")] if tool is not None and tool.is_writing_files() else []


def view() -> AgentView:
    program = Capabilities(*(Capability(part, event, CapabilityProof.IMPLEMENTED_HERE) for part in CapabilityPart for event in HookEventName))
    return replace(ViewSamples.view("main", WorkStop.REFUSE_WHILE_WORK_REMAINS), rank_order=RankOrder(("files.policies",), ()), program=program)


def shown_key(transform: RuleTransform, asked: Question) -> str:
    return AgentMachine(policies=[EditPolicy()], transforms=[transform]).step(view(), asked).record.shown_reason.key


def test_an_alias_expanded_into_an_edit_is_refused_by_the_policy_that_refuses_edits():
    alias = shell_question("journal fix", ShellPart("journal", CommandCategory.JOURNAL, ["fix"]))
    assert shown_key(SampleAliasTransform(SampleHooks(EDIT_LINE), SampleParser()), alias) == "files.no-edit"


def test_a_project_hook_that_rewrites_a_read_into_a_write_is_refused_by_the_policy_that_refuses_writes():
    read = shell_question("cat a.py", ShellPart("cat", CommandCategory.READ, ["a.py"]))
    assert shown_key(SampleProjectHookTransform(SampleHooks(WRITE_LINE), SampleParser()), read) == "files.no-edit"


def test_the_runner_wrap_is_judged_as_the_line_it_wraps():
    read = shell_question("cat a.py", ShellPart("cat", CommandCategory.READ, ["a.py"]))
    rewrite = SampleRunnerTransform(SampleHooks(EDIT_LINE), SampleParser()).applied(read, view())
    assert rewrite.changed() and rewrite.final_question(read) == read


class WrappingHooks(RuleHooks):
    """The runner's answer: the line it is asked about, wrapped."""

    def answer(self, rule: type[DriverRule], question: Question, agent_id: int) -> RuleAnswer | None:
        tool = question.tool()
        assert tool is not None and tool.shell is not None
        return RuleAnswer(updated_input={"command": f"journal-run -- {tool.shell.display_text}"})


def test_the_runner_wraps_the_line_the_alias_expanded():
    alias = shell_question("journal fix", ShellPart("journal", CommandCategory.JOURNAL, ["fix"]))
    transforms = [SampleAliasTransform(SampleHooks(EDIT_LINE), SampleParser()), SampleRunnerTransform(WrappingHooks(), SampleParser())]
    record = AgentMachine(transforms=transforms).step(view(), alias).record
    assert record.rewrite.tool_input == {"command": f"journal-run -- {EDIT_LINE}"}


def test_a_rule_transform_leaves_its_old_rule_answering():
    assert SampleAliasTransform.replaced_rules == ()
