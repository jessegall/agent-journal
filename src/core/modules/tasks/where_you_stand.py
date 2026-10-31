from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.modules.agents.agent import AgentRole
from core.modules.tasks.task_query import TaskQuery


class WhereYouStand(DriverRule):
    """An agent that gets control back after an overlay silenced it is told which task it holds, if any."""

    name = "tasks.where-you-stand"
    hook = "*"
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]
    history = True

    def __init__(self, tasks: TaskQuery) -> None:
        self.tasks = tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not hook.regained_control:
            return RuleAnswer.allowed()
        held = self.tasks.held_by(hook.agent_id).started().newest().page(1, 1).rows
        return RuleAnswer.with_lines(f"back to task {held[0].id}, {held[0].title}") if held else RuleAnswer.allowed()
