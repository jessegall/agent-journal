from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.support.option import Option
from journal.support.shipped import Shipped
from journal.features.voices.commands.voice_command import VoiceCommand
from journal.features.voices.listeners.introduce_at_start import IntroduceAtStart
from journal.features.voices.listeners.say_voice_when_changed import SayVoiceWhenChanged


class Voices(Feature):
    """The agent talks to you in the voice you choose, by your title and first name, as the voice says."""

    name = "voices"
    title = "Voice"
    help = "The agent talks to you in the voice you choose, by your title and first name."
    commands = (VoiceCommand,)
    PROFILE = Option("voices.profile", "Voice", "How the agent talks to you", "butler", kind="choice", choices=tuple(v.name for v in Shipped.ALL))
    TITLE = Option("voices.title", "Your title", "Sir, Madam, Captain: what the voice calls you before your name", "Sir", kind="text")
    NAME = Option("voices.name", "Your first name", "Empty takes the name git knows you by", "", kind="text")
    SPOKEN = (PROFILE, TITLE, NAME)
    """The settings the voice's words are made of: a change to one of them is a change of voice; the figure's look is not."""
    AVATAR = Option("voices.avatar", "Show a figure in the chat", "A small figure beside the chat shows what the agent is doing, in the voice it speaks", True, kind="switch")
    AVATAR_SHOWN = Option("voices.avatar_shown", "Show the figure", "Always, only while the agent works, or never", "always", kind="choice", choices=("always", "working", "never"))
    options = (PROFILE, TITLE, NAME, AVATAR, AVATAR_SHOWN)
    listeners = (SayVoiceWhenChanged, IntroduceAtStart)

    VOICE = Nudge(name, "voice", "how to talk to the user", "{{voice}}", repeat_after=0)
    INTRODUCE = Nudge(name, "introduce", "introduce yourself to the user in the chat", "one or two lines in your voice, then ask what to do, unless the user has already asked for something: then go on with it", repeat_after=0, answered_in_chat=True)
    CHANGED = Nudge(name, "changed", "the user changed how you talk to them", "From now on: {{voice}} Answer this with one opening sentence in the new voice in the chat, so the user hears the change, and add nothing else about it.", repeat_after=0, answered_in_chat=True)
    nudges = (VOICE, CHANGED, INTRODUCE)
