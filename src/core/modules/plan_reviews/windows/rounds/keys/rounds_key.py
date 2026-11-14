from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class RoundsKey(WindowKey):
    """The rounds.* data of the plan_reviews.rounds window."""

    name = "rounds.*"
    read = "plan rounds {id}"
    loading = KeyLoading.REQUESTED
