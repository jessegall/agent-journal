from engine.module.module import Module
from core.modules.voices.commands.set_voice_address.set_voice_address_handler import SetVoiceAddressHandler
from core.modules.voices.commands.set_voice_address.set_voice_address_subcommand import SetVoiceAddressSubcommand
from core.modules.voices.commands.choose_voice.choose_voice_subcommand import ChooseVoiceSubcommand
from core.modules.voices.commands.voice_list.voice_list_subcommand import VoiceListSubcommand
from core.modules.voices.commands.voice_show.voice_show_subcommand import VoiceShowSubcommand
from core.modules.voices.listeners.voice_change_listener import VoiceChangeListener
from core.modules.voices.listeners.voice_compaction_listener import VoiceCompactionListener
from core.modules.voices.listeners.voice_start_listener import VoiceStartListener
from core.modules.voices.support.voices_settings import VOICES_SETTINGS


class VoicesModule(Module):
    """Adds the voice the agent talks to you in, the title and first name it calls you by, and whether the
    chat shows a figure: chosen with journal voice, and told to the main agent when it starts, after a
    compaction and when it changes."""

    name = "journal.core.voices"
    move_reason = "version 4 kept the voice as settings, which move with the settings"
    seed_reason = "the voice is a setting with a default"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers", "journal.core.settings"]
    settings = VOICES_SETTINGS
    subcommands = [VoiceListSubcommand, ChooseVoiceSubcommand, SetVoiceAddressSubcommand, VoiceShowSubcommand]
    handlers = [SetVoiceAddressHandler]
    listeners = [VoiceStartListener, VoiceCompactionListener, VoiceChangeListener]
