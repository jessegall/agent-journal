from engine.viewer.window_key import WindowKey


class ReviewersKey(WindowKey):
    """The reviewers data of the reviews.reviewers window."""

    name = "reviewers"
    read = "agent list --role reviewer"
    events = ["agent.*"]
