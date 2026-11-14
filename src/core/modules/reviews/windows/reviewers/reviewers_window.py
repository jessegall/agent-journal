from engine.viewer.window import Window
from core.modules.reviews.support.skeletons import REVIEWS_REVIEWERS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.reviews.windows.reviewers.keys.reviewers_key import ReviewersKey


class ReviewersWindow(Window):
    """The Reviewers window."""

    name = "reviews.reviewers"
    title = "Reviewers"
    entry = "reviewers.js"
    loading = WindowLoading.COMPONENT
    skeleton = REVIEWS_REVIEWERS_SKELETON
    icon = WindowIcon.REVIEW
    place = WindowPlace.DROPDOWN
    reads = ["agent list"]
    events = ["agent.*"]
    keys = [ReviewersKey]
