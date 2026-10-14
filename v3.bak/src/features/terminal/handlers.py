from events import Fact
from events.agents import CommandRan
from features.terminal.log import kept
from receiving import Handler
from resources.types import AgentRow
from serving import ReadRows, SessionMemory


class KeepCommands(Handler[CommandRan]):
    def handle(self, event: CommandRan, agents: ReadRows[AgentRow], memory: SessionMemory) -> list[Fact]:
        kept(memory.of(agents.peek(event.agent).title), event)
        return []
