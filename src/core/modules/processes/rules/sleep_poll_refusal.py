import re

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.queries.process_query import ProcessQuery

SLEEP_LOOP = re.compile(r"^\s*(until|while)\s+(.+?)\s*[;\n]\s*do\s+sleep\s+\d+(?:\.\d+)?\s*[;\n]\s*done\s*$", re.DOTALL)
LOOPS = ("until", "while")
SLEEP = "sleep"


class SleepPollRefusal(DriverRule):
    """A line that only sleeps, or sleeps in a loop to check again, is refused: the agent watches the process
    or waits on it instead."""

    name = "processes.sleep-poll-refusal"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, processes: ProcessQuery) -> None:
        self.processes = processes

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error or len(shell.parts) != 1 or not self.is_sleep_poll(shell.parts[0]):
            return RuleAnswer.allowed()
        return RuleAnswer.refused(f"a sleep with nothing to wait on is refused: {self.watch_advice(hook)}")

    def is_sleep_poll(self, part: Part) -> bool:
        return part.program == SLEEP or (part.program in LOOPS and SLEEP_LOOP.match(part.text) is not None)

    def watch_advice(self, hook: AgentHook) -> str:
        running = self.processes.agent(hook.agent_id).running().newest().page(1, 1).rows
        if running:
            return f"watch process {running[0].id} with `journal output watch {running[0].id}`, or wait on it with `journal await \"<what>\" --until \"<script>\"`"
        return "wait with `journal await \"<what>\" --until \"<script>\"`"
