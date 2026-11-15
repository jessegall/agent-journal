from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.lines.watch_lines_lines import WATCH_LINES_KEY
from core.modules.processes.support.watch_progress import WatchProgress


class WatchLinesRule(DriverRule):
    """The old walk's answer for WatchLinesLines and WatchLinesEffect, which own it, until the walk is deleted."""

    name = WATCH_LINES_KEY
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, progress: WatchProgress) -> None:
        self.progress = progress

    def answer(self, hook: AgentHook) -> RuleAnswer:
        watched = self.progress.progress(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*watched.nudges).running(*watched.commands)
