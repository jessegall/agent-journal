from engine.viewer.window_key import WindowKey


class TestsScreenKey(WindowKey):
    """The tests screen of the settings."""

    name = "tests-screen"
    read = "setting-screen show tests"
    events = ["setting.*"]
