from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.subcommand.overview_reads import OverviewReads
from core.modules.drivers.commands.record_overview_read.record_overview_read import RecordOverviewRead
from core.modules.drivers.models.overview_read import OverviewRead
from core.modules.drivers.support.context_resets import ContextResets


class TableOverviewReads(OverviewReads):
    """Refuses an agent a second read of the same overview target in one context window: a read counts when it is
    newer than the agent's last compaction or clear."""

    def __init__(self, queries: Queries, bus: Bus, resets: ContextResets) -> None:
        self.queries, self.bus, self.resets = queries, bus, resets

    def check(self, actor: Actor, command_name: str, target: str, is_required: bool) -> None:
        if actor.type is not ActorType.AGENT or is_required:
            return
        read = self.queries.query(OverviewRead).filter(session_agent_id=actor.id, command_name=command_name, target=target).descending("id").first()
        if read is not None and read.created_at is not None and read.created_at.text > self.resets.last_reset(actor.id):
            raise Refusal("you read this overview already and it is still in your context")

    def note(self, actor: Actor, command_name: str, target: str) -> None:
        if actor.type is ActorType.AGENT:
            self.bus.run(RecordOverviewRead(command_name, target), actor)
