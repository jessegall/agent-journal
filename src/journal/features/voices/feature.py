from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.voices.commands.voice_command import VoiceCommand
from journal.features.voices.listeners.say_voice_at_start import SayVoiceAtStart
from journal.features.voices.listeners.say_voice_when_changed import SayVoiceWhenChanged


class Voices(Feature):
    """The agent talks to you in the voice you choose, by your title and first name, as the voice says."""

    name = "voices"
    title = "Voice"
    commands = (VoiceCommand,)
    listeners = (SayVoiceAtStart, SayVoiceWhenChanged)

    VOICE = Nudge(name, "voice", "how to talk to the user", "{{voice}}", repeat_after=0)
    CHANGED = Nudge(name, "changed", "the user changed how you talk to them", "From now on: {{voice}} Answer this with one opening sentence in the new voice in the chat, so the user hears the change, and add nothing else about it.", repeat_after=0)
    nudges = (VOICE, CHANGED)
