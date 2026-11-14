from engine.viewer.window_key import WindowKey


class FitnessKey(WindowKey):
    """The fitness data of the usage.fitness window."""

    name = "fitness"
    read = "usage fitness"
    arguments = ["agent"]
