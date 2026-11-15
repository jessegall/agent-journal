from engine.chat.mark_declaration import MarkDeclaration
from core.modules.drivers.models.enums.escalation_mark_type import EscalationMarkType
from core.modules.drivers.models.enums.escalation_mark_variant import EscalationMarkVariant
from core.modules.drivers.support.escalation_marks import ESCALATIONS_FAMILY


class EscalationMark(MarkDeclaration):
    """The mark EscalationMarkType.ESCALATION."""

    type = EscalationMarkType.ESCALATION
    variants = EscalationMarkVariant
    family = ESCALATIONS_FAMILY
    label = "Agents that asked for help"
    mark_icon = "stop"
