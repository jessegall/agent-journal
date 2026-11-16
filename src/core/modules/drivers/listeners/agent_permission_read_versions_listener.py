from engine.command.context import Context
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from core.modules.agents.models.agent_session import AgentSession
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.models.agent_escalation import AgentEscalation
from core.modules.drivers.models.hidden_state import HiddenState
from core.modules.drivers.models.context_compaction import ContextCompaction
from core.modules.drivers.models.driver_grant import DriverGrant
from core.modules.drivers.support.read_versions_writers import ReadVersionsWriters

PermissionRow = AgentBlock | AgentEscalation | HiddenState | ContextCompaction | DriverGrant | AgentSession


class AgentPermissionReadVersionsListener(SaveListener[Changed[AgentBlock] | Changed[AgentEscalation] | Changed[HiddenState]
                                                | Changed[ContextCompaction] | Changed[DriverGrant] | Changed[AgentSession]]):
    """A block opened, skipped or closed, an escalation answered, a suppression, a compaction attempt, a grant (a
    skip, a permission) asked, answered or spent and a session bound, replaced or ended each change what one agent may do:
    its answer basis moves in the same write (doc 1310 section 6.5)."""

    name = "drivers.permission-basis"

    def __init__(self, writers: ReadVersionsWriters) -> None:
        self.writers = writers

    def handle(self, event: Changed[PermissionRow], context: Context) -> None:
        self.writers.bump_agent(event.row.session_agent_id, context)
