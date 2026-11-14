from engine.viewer.window_key import WindowKey


class TranscriptionsKey(WindowKey):
    """The transcriptions data of the transcriptions.transcriptions window."""

    name = "transcriptions"
    read = "transcription list"
    events = ["transcription.*"]
