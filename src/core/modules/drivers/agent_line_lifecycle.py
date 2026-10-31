from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.drivers.agent_line_state import AgentLineState


class AgentLineLifecycle(Lifecycle):
    """A line waits until a hook gives it or the server types it."""

    states = AgentLineState
    initial = [AgentLineState.WAITING]
    editable = [AgentLineState.WAITING]
    deletable = [AgentLineState.GIVEN, AgentLineState.TYPED]

    give = Move("give", [AgentLineState.WAITING], AgentLineState.GIVEN)
    type = Move("type", [AgentLineState.WAITING], AgentLineState.TYPED)
