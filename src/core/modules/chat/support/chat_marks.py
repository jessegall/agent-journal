from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup

EXCEPTIONS_FAMILY = MarkFamily("chat.exceptions", "Exceptions", "warning", MarkGroup.JOURNAL)
UPGRADE_FAMILY = MarkFamily("chat.upgrade", "Upgrade", "summary", MarkGroup.JOURNAL)
PRIVATE_DATA_FAMILY = MarkFamily("chat.private-data", "Private data", "warning", MarkGroup.JOURNAL)
