from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.journal.journal_home import JournalHome
from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.serving.server_files import ServerFiles
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.send_journal_started_line.send_journal_started_line import SendJournalStartedLine


class HeldSessionWake:
    """Once the server is ready again, wakes every agent whose hook the journal held while it started or updated,
    also a hook held after the booting round."""

    def __call__(self, container: Container) -> None:
        files = ServerFiles(container.get(JournalHome))
        if not files.phase().runs_programs:
            return
        sessions = files.released_sessions()
        if not sessions:
            return
        for agent in container.get(Queries).query(Agent).matching(Among("session", sessions)).matching(IsNull("retired_at")).all_rows():
            container.get(Bus).run(SendJournalStartedLine(agent.id), Actor.core(), environment_id=agent.environment_id)
