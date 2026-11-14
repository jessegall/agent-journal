from engine.viewer.window_key import WindowKey


class BoardKey(WindowKey):
    """The board data of the reviews.reviewer window."""

    name = "board"
    read = "review board"
    events = ["review.*", "review_step.*", "reviewer.*"]
