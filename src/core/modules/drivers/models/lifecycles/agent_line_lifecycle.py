from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.drivers.models.enums.agent_line_state import AgentLineState


class AgentLineLifecycle(Lifecycle):
    """A line waits until a hook gives it or the server types it. A line being typed is out of a hook's reach, and
    waits again if the typing fails."""

    states = AgentLineState
    initial = [AgentLineState.WAITING]
    editable = [AgentLineState.WAITING]
    deletable = [AgentLineState.DELIVERED, AgentLineState.ENTERED]

    deliver = Move("deliver", [AgentLineState.WAITING], AgentLineState.DELIVERED)
    claim = Move("claim", [AgentLineState.WAITING], AgentLineState.TYPING)
    release = Move("release", [AgentLineState.TYPING], AgentLineState.WAITING)
    enter = Move("enter", [AgentLineState.WAITING, AgentLineState.TYPING], AgentLineState.ENTERED)
