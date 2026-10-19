from journal.events.models.created import Created
from journal.events.listener import Listener
from journal.features.sequences.running import Running
from journal.models.actor_kind import ActorKind
from journal.models.scoped import Scoped
from journal.repositories.agents import Agents
from journal.repositories.sequences import Sequences
from journal.supervisor_link import SupervisorLink


class StartOnCreated(Listener[Created]):
    """A row an agent creates starts the sequence that names that moment, such as Building a plan on plan.created, and so does a row the user hands the agent, such as a dump: the run is kept on that agent, or on the live agent here, about that row; the first step is typed to the agent, and a worker, which cannot be typed to, is told it at its next stop."""

    def __init__(self, sequences: Sequences, running: Running, supervisor: SupervisorLink, agents: Agents) -> None:
        self.sequences, self.running, self.supervisor, self.agents = sequences, running, supervisor, agents

    def handle(self, event: Created) -> None:
        row = event.model
        if not isinstance(row, Scoped):
            return
        session = self.session_for(event)
        if not session:
            return
        moment = f"{type(row).__name__.lower()}.created"
        for sequence in self.sequences.all():
            if sequence.starts_on == moment:
                line = self.running.start(sequence, session, row.environment_id, about=f"{row.table()}:{row.id}")
                if line and self.running.typed_to(session, row.environment_id):
                    self.supervisor.type(row.environment_id, line)
                return

    def session_for(self, event: Created) -> str:
        """The agent the run is kept on: the one that made the row, or the live one here for a row the user handed the agent; none otherwise."""
        if event.by.kind == ActorKind.AGENT:
            return event.by.id
        live = self.agents.live() if event.by.kind == ActorKind.USER and event.model.handed_to_agent else None
        return live.session if live else ""
