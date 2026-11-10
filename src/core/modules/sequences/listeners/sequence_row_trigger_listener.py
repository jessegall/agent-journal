from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit_listener import CommitListener
from engine.query.queries import Queries
from core.modules.documents.models.link import Link
from core.modules.sequences.commands.move_sequence_run.move_sequence_run import MoveSequenceRun, START
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.models.support.sequence_trigger import SequenceTrigger
from core.modules.sequences.support.sequence_events import SequenceEvents
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from engine.change.touched import Touched
from engine.model.model import Model


class SequenceRowTriggerListener(CommitListener[Touched[Model]]):
    """Starts a sequence for the triggering agent or main agent when a row matches a linked trigger."""

    name = "sequences.row-trigger"

    def __init__(self, queries: Queries, runs: SequenceRunQuery, bus: Bus, events: SequenceEvents) -> None:
        self.queries, self.runs, self.bus, self.events = queries, runs, bus, events

    def handle(self, event: Touched[Model], logged: LoggedEvent) -> None:
        linked = [row for row in self.events.matching(logged.event) if self.is_linked(row.trigger, logged)]
        agent_id = self.acting_agent_id(logged) if linked else None
        matched = next((row for row in linked if agent_id is not None and not self.runs.is_running(agent_id, row.sequence.id)), None)
        if agent_id is not None and matched is not None:
            self.bus.run(MoveSequenceRun(START, matched.sequence.id, subject_id=logged.row_id), Actor(agent_id, ActorType.AGENT), cause_id=logged.id)

    def acting_agent_id(self, logged: LoggedEvent) -> int | None:
        if self.queries.query(ActorRecord).find(logged.actor_id).type is ActorType.AGENT:
            return logged.actor_id
        agents = MainAgentFinder.rows(self.queries) if logged.environment_id is not None else ()
        return agents[0].id if agents else None

    def is_linked(self, trigger: SequenceTrigger, logged: LoggedEvent) -> bool:
        if not trigger.link_source:
            return True
        return self.queries.query(Link).filter(source_model=trigger.link_source, target_model=trigger.row_model, target_id=logged.row_id).exists()
