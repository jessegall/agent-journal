from engine.viewer.window_key import WindowKey


class VoiceAvatarVisibleKey(WindowKey):
    """The voice-avatar-shown data of the messages.avatar window."""

    name = "voice-avatar-shown"
    read = "setting show journal.core.voices.avatar-shown"
    events = ["setting.*"]
