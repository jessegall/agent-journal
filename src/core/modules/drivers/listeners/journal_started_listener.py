from engine.actor.actor import Actor
from engine.change.journal_booting import JournalBooting
from engine.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from engine.query.queries import Queries
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.drivers.commands.send_journal_started_line.send_journal_started_line import SendJournalStartedLine


class JournalStartedListener(CommitListener[JournalBooting]):
    """Wakes every running main agent as the journal starts."""

    name = "drivers.journal-started"

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        for agent in MainAgentFinder.all_running(self.queries):
            self.bus.run(SendJournalStartedLine(agent.id), Actor.core(), cause_id=logged.id, environment_id=agent.environment_id)
