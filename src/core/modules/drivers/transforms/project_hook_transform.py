from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.shell_parser import ShellParser
from engine.agent_machine.contracts.transform import Transform
from engine.agent_machine.record.question import Question
from engine.agent_machine.record.rewrite import Rewrite
from engine.enums.transform_slot import TransformSlot
from core.modules.drivers.support.foreign_hook_answers import MANAGED_HOOKS_KEY, ForeignHookAnswers


class ProjectHookTransform(Transform):
    """The input a project's own hook gave back replaces the tool's input, and a shell line it rewrote is parsed and
    judged again as the final action."""

    slot = TransformSlot.PROJECT_HOOK
    replaced_rules = tuple([MANAGED_HOOKS_KEY])

    def __init__(self, answers: ForeignHookAnswers, parser: ShellParser) -> None:
        self.answers, self.parser = answers, parser

    def applied(self, question: Question, view: AgentView) -> Rewrite:
        if question.event is None:
            return Rewrite.unchanged()
        updated = self.answers.answer(question.event, view.agent.agent_id).updated_input
        if not updated:
            return Rewrite.unchanged()
        command = updated.get("command")
        tool = question.tool()
        final = question.with_shell(self.parser.line(command)) if isinstance(command, str) and tool is not None and tool.shell is not None else question
        return Rewrite.replaced(updated, tuple([self.slot]), "", final)
