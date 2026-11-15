from engine.chat.mark_declaration import MarkDeclaration
from core.modules.reviews.models.enums.review_mark_type import ReviewMarkType
from core.modules.reviews.models.enums.review_mark_variant import ReviewMarkVariant
from core.modules.reviews.support.review_marks import REVIEWS_FAMILY


class ReviewMark(MarkDeclaration):
    """The mark ReviewMarkType.REVIEW."""

    type = ReviewMarkType.REVIEW
    variants = ReviewMarkVariant
    family = REVIEWS_FAMILY
    label = "Reviews and their reports"
    mark_icon = "review"
