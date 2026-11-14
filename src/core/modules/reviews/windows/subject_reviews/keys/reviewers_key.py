from engine.viewer.window_key import WindowKey


class ReviewersKey(WindowKey):
    """The reviewers data of the reviews.subject-reviews window."""

    name = "reviewers"
    read = "assignment list --subject-model review"
    events = ["assignment.*"]
