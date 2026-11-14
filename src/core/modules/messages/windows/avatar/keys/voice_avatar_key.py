from engine.viewer.window_key import WindowKey


class VoiceAvatarKey(WindowKey):
    """The voice-avatar data of the messages.avatar window."""

    name = "voice-avatar"
    read = "setting show journal.core.voices.avatar"
    events = ["setting.*"]
