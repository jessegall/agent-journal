from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from core.modules.documents.models.enums.text_mark_type import TextMarkType
from core.modules.documents.models.enums.text_mark_variant import TextMarkVariant
from core.modules.documents.support.text_marks import TEXT_READ_FAMILY


class TextReadMark(MarkDeclaration):
    """The mark TextMarkType.READ."""

    type = TextMarkType.READ
    variants = TextMarkVariant
    family = TEXT_READ_FAMILY
    label = "Document or report read"
    mark_icon = "document"
    click = MarkClick.OPEN_ROW
