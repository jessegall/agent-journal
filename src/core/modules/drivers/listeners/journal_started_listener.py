from engine.actor.actor import Actor
from engine.event.journal_booting import JournalBooting
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.journal.journal_home import JournalHome
from engine.listener.commit.commit_listener import CommitListener
from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.serving.server_files import ServerFiles
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.drivers.commands.send_journal_started_line.send_journal_started_line import SendJournalStartedLine


class JournalStartedListener(CommitListener[JournalBooting]):
    """Wakes every running main agent as the journal starts, and every agent whose hook the journal held while it
    started or updated."""

    name = "drivers.journal-started"

    def __init__(self, queries: Queries, bus: Bus, home: JournalHome) -> None:
        self.queries, self.bus, self.home = queries, bus, home

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        for agent in {agent.id: agent for agent in (*MainAgentFinder.all_running(self.queries), *self.held_agents())}.values():
            self.bus.run(SendJournalStartedLine(agent.id), Actor.core(), cause_id=logged.id, environment_id=agent.environment_id)

    def held_agents(self) -> tuple[Agent, ...]:
        sessions = ServerFiles(self.home).released_sessions()
        if not sessions:
            return ()
        return tuple(self.queries.query(Agent).matching(Among("session", sessions)).matching(IsNull("retired_at")).all_rows())
