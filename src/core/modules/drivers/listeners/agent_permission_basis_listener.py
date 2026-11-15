from engine.command.context import Context
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from core.modules.agents.models.agent_session import AgentSession
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.models.agent_escalation import AgentEscalation
from core.modules.drivers.models.agent_frame_suppression import AgentFrameSuppression
from core.modules.drivers.models.context_compaction import ContextCompaction
from core.modules.drivers.models.driver_grant import DriverGrant
from core.modules.drivers.models.refusal_skip import RefusalSkip
from core.modules.drivers.support.answer_basis_writers import AnswerBasisWriters

PermissionRow = RefusalSkip | AgentBlock | AgentEscalation | AgentFrameSuppression | ContextCompaction | DriverGrant | AgentSession


class AgentPermissionBasisListener(SaveListener[Changed[RefusalSkip] | Changed[AgentBlock] | Changed[AgentEscalation] | Changed[AgentFrameSuppression]
                                                | Changed[ContextCompaction] | Changed[DriverGrant] | Changed[AgentSession]]):
    """A skip or its use, a block opened, skipped or closed, an escalation answered, a suppression, a
    compaction attempt, a grant and a session bound, replaced or ended each change what one agent may do:
    its answer basis moves in the same write (doc 1310 section 6.5)."""

    name = "drivers.permission-basis"

    def __init__(self, writers: AnswerBasisWriters) -> None:
        self.writers = writers

    def handle(self, event: Changed[PermissionRow], context: Context) -> None:
        self.writers.bump_agent(event.row.session_agent_id, context)
