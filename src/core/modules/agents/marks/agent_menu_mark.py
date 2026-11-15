from engine.chat.mark_declaration import MarkDeclaration
from core.modules.agents.models.enums.agent_mark_type import AgentMarkType
from core.modules.agents.models.enums.agent_mark_variant import AgentMarkVariant
from core.modules.agents.support.agent_marks import MENUS_FAMILY


class AgentMenuMark(MarkDeclaration):
    """The mark AgentMarkType.MENU."""

    type = AgentMarkType.MENU
    variants = AgentMarkVariant
    family = MENUS_FAMILY
    label = "A menu in the agent's terminal was answered"
    mark_icon = "terminal"
