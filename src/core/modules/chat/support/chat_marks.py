from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.chat.models.enums.chat_mark_type import ChatMarkType
from core.modules.chat.models.enums.chat_mark_variant import ChatMarkVariant

FAULTS_FAMILY = MarkFamily("chat.faults", "Faults", "fault", MarkGroup.JOURNAL)

CHAT_MARKS = [MarkDeclaration(ChatMarkType.FAULT, ChatMarkVariant, FAULTS_FAMILY, "Faults of the journal", "fault", click=MarkClick.UNFOLD)]
