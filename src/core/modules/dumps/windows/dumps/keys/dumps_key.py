from engine.viewer.window_key import WindowKey


class DumpsKey(WindowKey):
    """The dumps data of the dumps.dumps window."""

    name = "dumps"
    read = "dump board"
    arguments = ["before"]
    events = ["dump.*", "dump_item.*"]
