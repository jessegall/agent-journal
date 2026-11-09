import re

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.process_nudges import SLEEP_REFUSED


SLEEP_LOOP = re.compile(r"^\s*(until|while)\s+(.+?)\s*[;\n]\s*do\s+sleep\s+\d+(?:\.\d+)?\s*[;\n]\s*done\s*$", re.DOTALL)
LOOPS = ("until", "while")
SLEEP = "sleep"
SLEEP_TOOLS = ["clocksleep"]


class SleepPollRule(DriverRule):
    """A line that only sleeps, sleeps in a loop to check again, or a sleep tool of the agent's program, is refused
    for every agent: it goes on working or stops, and the journal tells it when a run ends."""

    name = "processes.sleep-poll-refusal"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    refuses_one_action = "A line that only sleeps, sleeps in a loop to check again, or a sleep tool of the agent's program, is refused"

    def __init__(self, processes: ProcessQuery) -> None:
        self.processes = processes

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is not None and tool.name in SLEEP_TOOLS:
            return RuleAnswer.refused(SLEEP_REFUSED.nudge())
        shell = tool.shell if tool is not None else None
        if shell is None or shell.parse_error or not any(self.is_sleep_poll(part) for part in shell.parts):
            return RuleAnswer.allowed()
        return RuleAnswer.refused(SLEEP_REFUSED.nudge())

    def is_sleep_poll(self, part: Part) -> bool:
        return part.program == SLEEP or (part.program in LOOPS and SLEEP_LOOP.match(part.text) is not None)
