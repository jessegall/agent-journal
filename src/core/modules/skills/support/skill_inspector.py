from core.base.viewer.inspector_component import InspectorComponent
from core.base.viewer.inspector_declaration import InspectorDeclaration
from core.base.viewer.inspector_width import InspectorWidth
from core.modules.skills.models.agent_skill import AgentSkill

SKILL_INSPECTOR = InspectorDeclaration(
    AgentSkill,
    reads="agent-skill show {row_id}",
    label="Skill",
    title="{skill}",
    width=InspectorWidth.MEDIUM,
    events=("agent_skill.*",),
    components=(InspectorComponent("skills.skill-body"),),
    links=None,
)
