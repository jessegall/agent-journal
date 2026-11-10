from engine.actor.actor import Actor
from engine.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit_listener import CommitListener
from engine.query.queries import Queries
from core.modules.drivers.commands.release_agent_line.release_agent_line import ReleaseAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from engine.change.journal_booting import JournalBooting


class ClaimedLineReleaseListener(CommitListener[JournalBooting]):
    """As the journal starts, a line left in typing by a server that stopped during the typing waits again for a
    hook."""

    name = "drivers.claimed-line-release"

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        for line in self.queries.query(AgentLine).filter(state=AgentLineState.TYPING).all_rows():
            self.bus.run(ReleaseAgentLine(line.id), Actor.core())
