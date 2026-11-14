from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class ReviewsKey(WindowKey):
    """The reviews.* data of the reviews.subject-reviews window."""

    name = "reviews.*"
    read = "review list --subject {id} --oldest"
    events = ["review.*"]
    loading = KeyLoading.REQUESTED
