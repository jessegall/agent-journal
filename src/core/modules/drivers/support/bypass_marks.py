from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.drivers.models.enums.bypass_mark_type import BypassMarkType
from core.modules.drivers.models.enums.debt_mark_type import DebtMarkType
from core.modules.drivers.models.enums.debt_mark_variant import DebtMarkVariant
from core.modules.drivers.models.enums.bypass_mark_variant import BypassMarkVariant

BYPASS_FAMILY = MarkFamily("drivers.bypass", "Unchecked work", "stop", MarkGroup.JOURNAL)

DEBTS_FAMILY = MarkFamily("drivers.debts", "Skipped lines", "stop", MarkGroup.JOURNAL)

BYPASS_MARKS = [MarkDeclaration(DebtMarkType.SKIPPED, DebtMarkVariant, DEBTS_FAMILY, "Lines the agent skipped", "stop"), MarkDeclaration(BypassMarkType.BYPASS, BypassMarkVariant, BYPASS_FAMILY, "Hooks that went through while the journal did not answer", "stop")]
