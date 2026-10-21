from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.support.option import Option
from journal.support.builtin_catalogue import BuiltinCatalogue
from journal.features.voices.commands.voice_command import VoiceCommand
from journal.features.voices.support.voices_conduct import VoicesConduct
from journal.features.voices.support.voices_data_reader import VoicesDataReader
from journal.features.voices.support.voices_data import VoicesData


class Voices(Feature[VoicesData]):
    """The agent talks to you in the voice you choose, by your title and first name, as the voice says."""

    name = "voices"
    title = "Voice"
    help = "The agent talks to you in the voice you choose, by your title and first name."
    commands = (VoiceCommand,)
    PROFILE = Option("voices.profile", "Voice", "How the agent talks to you", "butler", kind="choice", choices=tuple(v.name for v in BuiltinCatalogue.ALL))
    TITLE = Option("voices.title", "Your title", "Sir, Madam, Captain: what the voice calls you before your name", "Sir", kind="text")
    NAME = Option("voices.name", "Your first name", "Empty takes the name git knows you by", "", kind="text")
    VOICE_OPTIONS = (PROFILE, TITLE, NAME)
    AVATAR = Option("voices.avatar", "Show a figure in the chat", "A small figure beside the chat shows what the agent is doing, in the voice it speaks", True, kind="switch")
    AVATAR_SHOWN = Option("voices.avatar_shown", "Show the figure", "Always, only while the agent works, or never", "always", kind="choice", choices=("always", "working", "never"))
    options = (PROFILE, TITLE, NAME, AVATAR, AVATAR_SHOWN)
    data = (VoicesDataReader,)
    conduct = (VoicesConduct,)

    VOICE_INSTRUCTION = Nudge(name, "how_to_talk_to_the_user", "how to talk to the user", "{{voice}}", repeat_after=0)
    INTRODUCE_YOURSELF = Nudge(name, "introduce_yourself", "introduce yourself to the user in the chat", "one or two lines in your voice, then ask what to do, unless the user has already asked for something: then go on with it", repeat_after=0, answered_in_chat=True)
    VOICE_CHANGE = Nudge(name, "the_voice_changed", "the user changed how you talk to them", "From now on: {{voice}} Answer this with one opening sentence in the new voice in the chat, so the user hears the change, and add nothing else about it.", repeat_after=0, answered_in_chat=True)
    RETURN_GREETING = Nudge(name, "say_you_are_back", "you are back in a conversation that went on before: say so to the user in a line, in your voice", "then carry on with what was in hand, or ask what to do", repeat_after=0)
    nudges = (VOICE_INSTRUCTION, VOICE_CHANGE, INTRODUCE_YOURSELF, RETURN_GREETING)
