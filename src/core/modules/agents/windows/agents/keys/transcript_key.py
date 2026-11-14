from engine.viewer.window_key import WindowKey


class TranscriptKey(WindowKey):
    """The transcript.* data of the agents.agents window."""

    name = "transcript.*"
    read = "agent transcript row:{id}"
    arguments = ["before-id"]
    page_size = 50
