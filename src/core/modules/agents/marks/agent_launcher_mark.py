from engine.chat.mark_declaration import MarkDeclaration
from core.modules.agents.models.enums.agent_mark_type import AgentMarkType
from core.modules.agents.models.enums.agent_mark_variant import AgentMarkVariant
from core.modules.agents.support.agent_marks import LAUNCHERS_FAMILY


class AgentLauncherMark(MarkDeclaration):
    """The mark AgentMarkType.LAUNCHER."""

    type = AgentMarkType.LAUNCHER
    variants = AgentMarkVariant
    family = LAUNCHERS_FAMILY
    label = "A second launcher was stopped"
    mark_icon = "terminal"
