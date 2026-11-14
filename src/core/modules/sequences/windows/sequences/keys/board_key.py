from engine.viewer.window_key import WindowKey


class BoardKey(WindowKey):
    """The board data of the sequences.sequences window."""

    name = "board"
    read = "sequence board"
    events = ["sequence.*", "sequence_run.*"]
