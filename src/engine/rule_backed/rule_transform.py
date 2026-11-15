from typing import ClassVar

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.shell_parser import ShellParser
from engine.agent_machine.contracts.transform import Transform
from engine.agent_machine.record.question import Question
from engine.agent_machine.record.rewrite import Rewrite
from engine.driver.driver_rule import DriverRule
from engine.rule_backed.rule_events import RuleEvents
from engine.rule_backed.rule_hooks import RuleHooks


class RuleTransform(Transform):
    """A transform of the agent machine whose rewrite is the one an old rule gives at its hook, the same input
    in the same words. A rewritten shell line is parsed by the hook client's parser and judged again as the
    final action, unless the transform only wraps the line it was given. The old rule stays the one that
    rewrites and prints the input: the runner's rewrite needs the process row its own command makes first."""

    rule: ClassVar[type[DriverRule]]
    replaces_action: ClassVar[bool] = True

    def __init__(self, hooks: RuleHooks, parser: ShellParser) -> None:
        self.hooks, self.parser = hooks, parser

    def applied(self, question: Question, view: AgentView) -> Rewrite:
        if question.event is None or question.event.event not in RuleEvents.hook_events(self.rule):
            return Rewrite.unchanged()
        answer = self.hooks.answer(self.rule, question, view.agent.agent_id)
        if answer is None or not answer.updated_input:
            return Rewrite.unchanged()
        command = answer.updated_input.get("command")
        final = self.final_question(question, command) if isinstance(command, str) else question
        return Rewrite.replaced(answer.updated_input, tuple([self.slot]), "", final)

    def final_question(self, question: Question, command: str) -> Question:
        tool = question.tool()
        if not self.replaces_action or tool is None or tool.shell is None:
            return question
        return question.with_shell(self.parser.line(command))
