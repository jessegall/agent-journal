from engine.chat.mark_declaration import MarkDeclaration
from core.modules.chat.models.enums.chat_mark_type import ChatMarkType
from engine.enums.mark_click import MarkClick
from core.modules.chat.models.enums.upgrade_mark_variant import UpgradeMarkVariant
from core.modules.chat.support.chat_marks import UPGRADE_FAMILY


class ChatUpgradeMark(MarkDeclaration):
    """The mark ChatMarkType.UPGRADE."""

    type = ChatMarkType.UPGRADE
    variants = UpgradeMarkVariant
    family = UPGRADE_FAMILY
    label = "Upgrade from version 4"
    mark_icon = "summary"
    click = MarkClick.UNFOLD
