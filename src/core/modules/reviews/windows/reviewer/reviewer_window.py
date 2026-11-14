from engine.viewer.window import Window
from core.modules.reviews.support.review_step_searcher import ReviewStepSearcher
from core.modules.reviews.support.skeletons import REVIEWS_REVIEWER_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.viewer.window_search import WindowSearch
from core.modules.reviews.windows.reviewer.keys.board_key import BoardKey


class ReviewerWindow(Window):
    """The Reviewer window."""

    name = "reviews.reviewer"
    title = "Reviewer"
    entry = "reviewer.js"
    loading = WindowLoading.COMPONENT
    skeleton = REVIEWS_REVIEWER_SKELETON
    search = WindowSearch(ReviewStepSearcher, "Search the reviews")
    icon = WindowIcon.REVIEW
    reads = ["review board", "review-step board", "reviewer list"]
    events = ["review.*", "review_step.*", "reviewer.*"]
    keys = [BoardKey]
