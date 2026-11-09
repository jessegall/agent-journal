from core.base.driver.agent_hook import AgentHook
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.rules.task_stop_rule import TaskStopRule


class AutoModeTaskStopRule(TaskStopRule):
    """In auto mode a stop with a started task in hand is refused even while a wait is open, which silences
    the ordinary rules: the agent blocks, completes or cancels the task instead."""

    name = "tasks.carry-on-at-stop-in-auto-mode"
    overlay_proof = True

    def answer(self, hook: AgentHook) -> RuleAnswer:
        assigner = self.assigners.assigner()
        if assigner is None or not assigner.is_automatic():
            return RuleAnswer.allowed("auto mode is off")
        return super().answer(hook)
