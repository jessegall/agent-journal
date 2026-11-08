from core.base.viewer.button_condition import ButtonCondition
from core.base.viewer.button_declaration import ButtonDeclaration
from core.base.viewer.inspector_component import InspectorComponent
from core.base.viewer.inspector_declaration import InspectorDeclaration
from core.base.viewer.inspector_width import InspectorWidth
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.agent_activity import AgentActivity

AGENT_INSPECTOR = InspectorDeclaration(
    Agent,
    reads="agent show {row_id}",
    label="Agent · {activity}",
    title="{display_name}",
    width=InspectorWidth.MEDIUM,
    events=tuple(["agent.*"]),
    actions=(
        ButtonDeclaration("agents.pause", (), "Pause the agent", "agent pause {row_id}", icon="pause", condition=ButtonCondition("activity", tuple([AgentActivity.WORKING.value]))),
        ButtonDeclaration("agents.resume", (), "Resume the agent", "agent resume {row_id}", icon="resume", primary=True, condition=ButtonCondition("activity", tuple([AgentActivity.PAUSED.value]))),
        ButtonDeclaration("agents.stop", (), "Stop the agent", "agent stop {row_id}", icon="stop", danger=True, confirm="Stop the agent? It stops what it is doing.",
                          condition=ButtonCondition("activity", (AgentActivity.WORKING.value, AgentActivity.PAUSED.value, AgentActivity.AT_USAGE_LIMIT.value))),
    ),
    components=tuple([InspectorComponent("agents.agent-detail")]),
    links=None,
)
