from core.modules.profiles.declarations.profiles_move_reason import PROFILES_MOVE_REASON
from core.modules.profiles.windows.profiles_windows import PROFILES_WINDOWS
from core.modules.profiles.commands.remove_profile.remove_profile_handler import RemoveProfileHandler
from core.modules.profiles.commands.remove_profile.remove_profile_subcommand import RemoveProfileSubcommand
from core.modules.profiles.commands.show_profile.show_profile_subcommand import ShowProfileSubcommand
from core.modules.profiles.commands.reset_profile.reset_profile_handler import ResetProfileHandler
from core.modules.profiles.commands.reset_profile.reset_profile_subcommand import ResetProfileSubcommand
from engine.module.module import Module
from core.modules.profiles.listeners.profile_publish_listener import ProfilePublishListener
from core.modules.profiles.support.profile_settings import PROFILE_SETTINGS


class ProfilesModule(Module):
    """Publishes declared agent profiles and provides their list and editing commands."""

    name = "journal.core.profiles"
    seed_reason = "its rows are files the journal writes at every start"
    move_reason = PROFILES_MOVE_REASON
    requires_engine = ">=6,<7"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.settings"]
    settings = PROFILE_SETTINGS
    handlers = [ResetProfileHandler, RemoveProfileHandler]
    subcommands = [ResetProfileSubcommand, RemoveProfileSubcommand, ShowProfileSubcommand]
    listeners = [ProfilePublishListener]
    windows = PROFILES_WINDOWS
