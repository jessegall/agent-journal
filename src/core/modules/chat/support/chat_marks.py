from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.chat.models.enums.chat_mark_type import ChatMarkType
from core.modules.chat.models.enums.chat_mark_variant import ChatMarkVariant
from core.modules.chat.models.enums.upgrade_mark_variant import UpgradeMarkVariant

EXCEPTIONS_FAMILY = MarkFamily("chat.exceptions", "Exceptions", "warning", MarkGroup.JOURNAL)
UPGRADE_FAMILY = MarkFamily("chat.upgrade", "Upgrade", "summary", MarkGroup.JOURNAL)

CHAT_MARKS = [MarkDeclaration(ChatMarkType.EXCEPTION, ChatMarkVariant, EXCEPTIONS_FAMILY, "Exceptions of the journal", "warning", click=MarkClick.UNFOLD),
              MarkDeclaration(ChatMarkType.UPGRADE, UpgradeMarkVariant, UPGRADE_FAMILY, "Upgrade from version 4", "summary", click=MarkClick.UNFOLD)]
