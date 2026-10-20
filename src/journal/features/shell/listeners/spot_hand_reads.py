import re
from collections import defaultdict, deque

from journal.engine.state_machine import StateMachine
from journal.engine.nudger import Nudger
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.support.decision import Decision
from journal.features.shell.support.readers import Readers

KEPT = 25
"""The reads of outputs remembered per session."""
OUTPUT = re.compile(r"outputs/[\w.-]+|(?<=journal output read )\d+")
"""Where a command names one output: its folder or its number."""
WHOLE = re.compile(r"\s*journal output read \d+\s*")
"""A plain read of an output's summary, which no reader could do better."""


class SpotHandReads(AgentListener[ToolStarting]):
    """A read of an output written by hand is a reader's work: one that does what a reader of the project's already does is pointed at it, and one that comes back among the last twenty-five, whichever output it reads, is a reader waiting to be written; each is said once."""

    blocking = True

    def __init__(self, machine: StateMachine, nudger: Nudger, readers: Readers) -> None:
        self.machine, self.nudger, self.readers = machine, nudger, readers
        self._reads: dict[str, deque] = defaultdict(lambda: deque(maxlen=KEPT))
        self._tipped: dict[str, set] = defaultdict(set)

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.shell.feature import Shell
        command = event.input.get("command", "") if event.tool == "Bash" else ""
        if not OUTPUT.search(command) or "--reader" in command or WHOLE.fullmatch(command):
            return None
        matching = next((r for r in self.readers.all() if r.matches(command) and r.name not in self._tipped[event.session]), None)
        if matching is not None:
            self._tipped[event.session].add(matching.name)
            return self.said(event, Shell.USE_THE_READER.create(reader=matching.name, about=matching.about))
        shape = OUTPUT.sub("<output>", command)
        reads = self._reads[event.session]
        seen = shape in reads
        reads.append(shape)
        if not seen or shape in self._tipped[event.session]:
            return None
        self._tipped[event.session].add(shape)
        return self.said(event, Shell.ADD_A_READER.create(command=shape))

    def said(self, event: ToolStarting, nudge) -> Decision | None:
        line = self.nudger.say(self.machine.agent(event.session, event.environment_id), nudge)
        return Decision.allowed_with(line) if line else None
