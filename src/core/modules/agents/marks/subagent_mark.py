from engine.chat.mark_declaration import MarkDeclaration
from core.modules.agents.models.enums.agent_mark_type import AgentMarkType
from core.modules.agents.models.enums.agent_mark_variant import AgentMarkVariant
from engine.enums.mark_click import MarkClick
from core.modules.agents.support.agent_marks import HELPERS_FAMILY


class SubagentMark(MarkDeclaration):
    """The mark AgentMarkType.SUBAGENT."""

    type = AgentMarkType.SUBAGENT
    variants = AgentMarkVariant
    family = HELPERS_FAMILY
    label = "Helper updates"
    mark_icon = "subagent"
    click = MarkClick.OPEN_ROW
    group_label = "{count} helper updates"
