from engine.chat.mark_declaration import MarkDeclaration
from core.modules.drivers.models.enums.required_command_mark_type import RequiredCommandMarkType
from core.modules.drivers.models.enums.required_command_mark_variant import RequiredCommandMarkVariant
from core.modules.drivers.support.bypass_marks import REQUIRED_COMMANDS_FAMILY


class RequiredCommandSkippedMark(MarkDeclaration):
    """The mark RequiredCommandMarkType.SKIPPED."""

    type = RequiredCommandMarkType.SKIPPED
    variants = RequiredCommandMarkVariant
    family = REQUIRED_COMMANDS_FAMILY
    label = "Lines the agent skipped"
    mark_icon = "stop"
