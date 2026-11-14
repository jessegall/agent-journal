from engine.model.lifecycle import Lifecycle
from engine.model.move import Move
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState


class AgentSkillLifecycle(Lifecycle):
    states = AgentSkillState
    initial = [AgentSkillState.DUE]
    editable = [AgentSkillState.DUE, AgentSkillState.LOADED]
    deletable = [AgentSkillState.DUE, AgentSkillState.LOADED]

    load = Move("load", [AgentSkillState.DUE], AgentSkillState.LOADED)
    reset = Move("reset", [AgentSkillState.LOADED], AgentSkillState.DUE)
