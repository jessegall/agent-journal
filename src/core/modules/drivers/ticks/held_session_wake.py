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

RELEASED_SESSIONS_REASON = "every kept agent of a released session is woken"


class ReleasedSessionWake:
    """Once the server is ready again, wakes every agent whose hook the journal held while it started or updated,
    also a hook held after the booting round: a round moves the held sessions aside and the next round wakes them,
    so a session held during the move is woken too."""

    def __call__(self, container: Container) -> None:
        files = ServerFiles(container.get(JournalHome))
        if not files.phase().runs_programs:
            return
        held = files.held_sessions()
        sessions = tuple(dict.fromkeys(held.taken_lines()))
        if sessions:
            for agent in container.get(Queries).query(Agent).matching(Among("session", sessions)).matching(IsNull("retired_at")).every_row(RELEASED_SESSIONS_REASON):
                container.get(Bus).run(SendJournalStartedLine(agent.id), Actor.core(), environment_id=agent.environment_id)
        held.move_aside()
