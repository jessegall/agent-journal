from engine.chat.mark_declaration import MarkDeclaration
from core.modules.chat.models.enums.chat_mark_type import ChatMarkType
from core.modules.chat.models.enums.private_data_mark_variant import PrivateDataMarkVariant
from core.modules.chat.support.chat_marks import PRIVATE_DATA_FAMILY


class ChatPrivateDataMark(MarkDeclaration):
    """The mark ChatMarkType.PRIVATE_DATA."""

    type = ChatMarkType.PRIVATE_DATA
    variants = PrivateDataMarkVariant
    family = PRIVATE_DATA_FAMILY
    label = "Private data found in a file"
    mark_icon = "warning"
