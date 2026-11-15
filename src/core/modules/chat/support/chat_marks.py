from engine.chat.mark_category import MarkCategory
from engine.enums.mark_group import MarkGroup

EXCEPTIONS_FAMILY = MarkCategory("chat.exceptions", "Exceptions", "warning", MarkGroup.JOURNAL)
UPGRADE_FAMILY = MarkCategory("chat.upgrade", "Upgrade", "summary", MarkGroup.JOURNAL)
PRIVATE_DATA_FAMILY = MarkCategory("chat.private-data", "Private data", "warning", MarkGroup.JOURNAL)
