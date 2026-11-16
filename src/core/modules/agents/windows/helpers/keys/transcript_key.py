from engine.viewer.window_key import WindowKey


class TranscriptKey(WindowKey):
    """The transcript.* data of the agents.helpers window."""

    name = "transcript.*"
    read = "agent transcript {id}"
    arguments = ["before-id"]
    page_size = 50
