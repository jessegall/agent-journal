from engine.chat.mark_click import MarkClick
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.chat.mark_group import MarkGroup
from core.modules.documents.models.enums.text_mark_type import TextMarkType
from core.modules.documents.models.enums.text_mark_variant import TextMarkVariant

TEXT_READ_FAMILY = MarkFamily("documents.reads", "Documents and reports", "document", MarkGroup.AGENT)
TEXT_MARKS = [MarkDeclaration(TextMarkType.READ, TextMarkVariant, TEXT_READ_FAMILY, "Document or report read", "document", click=MarkClick.OPEN_ROW)]
