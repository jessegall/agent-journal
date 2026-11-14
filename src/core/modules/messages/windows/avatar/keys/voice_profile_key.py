from engine.viewer.window_key import WindowKey


class VoiceProfileKey(WindowKey):
    """The voice-profile data of the messages.avatar window."""

    name = "voice-profile"
    read = "setting show journal.core.voices.profile"
    events = ["setting.*"]
