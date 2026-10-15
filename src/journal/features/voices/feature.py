from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.voices.commands.voice_command import VoiceCommand
from journal.features.voices.listeners.introduce_at_start import IntroduceAtStart
from journal.features.voices.listeners.say_voice_at_start import SayVoiceAtStart
from journal.features.voices.listeners.say_voice_when_changed import SayVoiceWhenChanged


class Voices(Feature):
    """The agent talks to you in the voice you choose, by your title and first name, as the voice says."""

    name = "voices"
    title = "Voice"
    help = "The agent talks to you in the voice you choose, by your title and first name."
    commands = (VoiceCommand,)
    listeners = (SayVoiceAtStart, SayVoiceWhenChanged, IntroduceAtStart)

    VOICE = Nudge(name, "voice", "how to talk to the user", "{{voice}}", repeat_after=0)
    INTRODUCE = Nudge(name, "introduce", "introduce yourself to the user in the chat", "one or two lines in your voice, then ask what to do; nothing else", repeat_after=0, answered_in_chat=True)
    CHANGED = Nudge(name, "changed", "the user changed how you talk to them", "From now on: {{voice}} Answer this with one opening sentence in the new voice in the chat, so the user hears the change, and add nothing else about it.", repeat_after=0, answered_in_chat=True)
    nudges = (VOICE, CHANGED)
