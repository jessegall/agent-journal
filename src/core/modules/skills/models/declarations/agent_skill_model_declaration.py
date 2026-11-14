from engine.module.model_declaration import ModelDeclaration
from core.modules.skills.commands.load_agent_skill.load_agent_skill import LoadAgentSkill
from core.modules.skills.models.agent_skill import AgentSkill


class AgentSkillModelDeclaration(ModelDeclaration):
    """How the module declares AgentSkill."""

    model = AgentSkill
    commands = [LoadAgentSkill]
