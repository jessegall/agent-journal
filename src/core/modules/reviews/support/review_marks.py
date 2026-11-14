from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup
from core.modules.reviews.models.enums.review_mark_type import ReviewMarkType
from core.modules.reviews.models.enums.review_mark_variant import ReviewMarkVariant

REVIEWS_FAMILY = MarkFamily("reviews.reviews", "Reviews", "review", MarkGroup.WORK)

REVIEW_MARKS = [MarkDeclaration(ReviewMarkType.REVIEW, ReviewMarkVariant, REVIEWS_FAMILY, "Reviews and their reports", "review")]
