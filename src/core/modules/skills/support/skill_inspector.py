from engine.viewer.inspector_component import InspectorComponent
from engine.viewer.inspector_declaration import InspectorDeclaration
from engine.enums.inspector_width import InspectorWidth
from core.modules.skills.models.agent_skill import AgentSkill

SKILL_INSPECTOR = InspectorDeclaration(
    AgentSkill,
    reads="agent-skill show {row_id}",
    label="Skill",
    title="{skill}",
    width=InspectorWidth.MEDIUM,
    events=tuple(["agent_skill.*"]),
    components=tuple([InspectorComponent("skills.skill-body")]),
    links=None,
)
