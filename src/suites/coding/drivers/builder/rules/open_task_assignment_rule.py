from suites.coding.support.coding_nudges import TASK_IS_YOURS
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.coding_settings import AUTO_MODE_SETTING
from suites.coding.support.next_task import NextTask
from core.modules.tasks.commands.start_task.start_task import StartTask


class OpenTaskAssignmentRule(DriverRule):
    """While auto mode is on, a builder that stops with no task started is given the next task, started as its own,
    and goes on with it."""

    name = "coding.builder-next-task-at-stop"
    hook = HookEventName.STOP

    def __init__(self, tasks: TaskQuery, next_task: NextTask, settings: SettingValues) -> None:
        self.tasks, self.next_task, self.settings = tasks, next_task, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not self.settings.flag(AUTO_MODE_SETTING, hook.environment_id) or self.tasks.holder(hook.agent_id).started().exists():
            return RuleAnswer.allowed()
        following = self.next_task.following(hook.environment_id)
        if following is None:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(TASK_IS_YOURS.nudge(task=following.id, title=following.title, brief=following.brief or "no brief")).running(StartTask(following.id))
