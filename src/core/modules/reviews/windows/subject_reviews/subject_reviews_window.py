from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.skeleton_part import SkeletonPart
from core.modules.reviews.windows.subject_reviews.keys.reviews_key import ReviewsKey
from core.modules.reviews.windows.subject_reviews.keys.reviewers_key import ReviewersKey


class SubjectReviewsWindow(Window):
    """The Reviews window."""

    name = "reviews.subject-reviews"
    title = "Reviews"
    entry = "subject-reviews.js"
    loading = WindowLoading.COMPONENT
    place = WindowPlace.SECTION
    slots = tuple(["inspector.plan"])
    icon = WindowIcon.REVIEW
    reads = ["review list", "assignment list"]
    events = ["review.*", "assignment.*"]
    skeleton = tuple([SkeletonPart.line()])
    keys = [ReviewsKey, ReviewersKey]
