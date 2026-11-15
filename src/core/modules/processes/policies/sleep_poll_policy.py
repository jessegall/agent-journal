from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
import re

from engine.driver.part import Part
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.nudges.sleep_refusal_message import SleepRefusalMessage


SLEEP_LOOP = re.compile(r"^\s*(until|while)\s+(.+?)\s*[;\n]\s*do\s+sleep\s+\d+(?:\.\d+)?\s*[;\n]\s*done\s*$", re.DOTALL)
LOOPS = ("until", "while")
SLEEP = "sleep"
SLEEP_TOOLS = ["clocksleep"]


class SleepPollPolicy(EventPolicy):
    """A line that only sleeps, sleeps in a loop to check again, or a sleep tool of the agent's program, is refused
    for every agent: it goes on working or stops, and the journal tells it when a run ends."""

    key = "processes.sleep-poll-refusal"
    rank = "shell.all"

    def __init__(self, processes: ProcessQuery) -> None:
        self.processes = processes

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        tool = event.tool
        if tool is not None and tool.name in SLEEP_TOOLS:
            return SleepRefusalMessage.declared().nudge()
        shell = tool.shell if tool is not None else None
        if shell is None or shell.parse_error or not any(self.is_sleep_poll(part) for part in shell.parts):
            return None
        return SleepRefusalMessage.declared().nudge()

    def is_sleep_poll(self, part: Part) -> bool:
        return part.program == SLEEP or (part.program in LOOPS and SLEEP_LOOP.match(part.text) is not None)
