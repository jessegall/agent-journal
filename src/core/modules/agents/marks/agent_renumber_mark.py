from engine.chat.mark_declaration import MarkDeclaration
from core.modules.agents.models.enums.agent_renumber_mark_type import AgentRenumberMarkType
from core.modules.agents.models.enums.agent_renumber_mark_variant import AgentRenumberMarkVariant
from core.modules.agents.support.agent_marks import RENUMBER_FAMILY


class AgentRenumberMark(MarkDeclaration):
    """The mark AgentRenumberMarkType.RENUMBER."""

    type = AgentRenumberMarkType.RENUMBER
    variants = AgentRenumberMarkVariant
    family = RENUMBER_FAMILY
    label = "Agents were renumbered"
    mark_icon = "subagent"
