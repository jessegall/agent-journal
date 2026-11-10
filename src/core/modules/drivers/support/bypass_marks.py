from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.chat.mark_group import MarkGroup
from core.modules.drivers.models.enums.bypass_mark_type import BypassMarkType
from core.modules.drivers.models.enums.required_command_mark_type import RequiredCommandMarkType
from core.modules.drivers.models.enums.required_command_mark_variant import RequiredCommandMarkVariant
from core.modules.drivers.models.enums.bypass_mark_variant import BypassMarkVariant

BYPASS_FAMILY = MarkFamily("drivers.bypass", "Unchecked work", "stop", MarkGroup.JOURNAL)

REQUIRED_COMMANDS_FAMILY = MarkFamily("drivers.required_commands", "Skipped lines", "stop", MarkGroup.JOURNAL)

BYPASS_MARKS = [MarkDeclaration(RequiredCommandMarkType.SKIPPED, RequiredCommandMarkVariant, REQUIRED_COMMANDS_FAMILY, "Lines the agent skipped", "stop"), MarkDeclaration(BypassMarkType.BYPASS, BypassMarkVariant, BYPASS_FAMILY, "Hooks that went through while the journal did not answer", "stop")]
