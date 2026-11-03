from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.profiles.commands.count_profile_use.count_profile_use_handler import CountProfileUseHandler
from core.modules.profiles.commands.profile_list.profile_list_subcommand import ProfileListSubcommand
from core.modules.profiles.commands.save_profile.save_profile_handler import SaveProfileHandler
from core.modules.profiles.commands.save_profile.save_profile_subcommand import SaveProfileSubcommand
from core.modules.profiles.listeners.profile_publish_listener import ProfilePublishListener
from core.modules.profiles.rules.profile_use_rule import ProfileUseRule
from core.modules.profiles.support.profile_settings import PROFILE_SETTINGS


class ProfilesModule(Module):
    """Adds agent profiles: the journal's own workers and subagents written into the agent programs' folders at
    every start, the ones a person saves beside them, and the page that lists and edits them."""

    name = "journal.core.profiles"
    seed_reason = "its rows are files the journal writes at every start"
    move_reason = "version 4's profiles are files that stay in place; their counts and settings move with the statistics and the settings"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.settings", "journal.core.drivers", "journal.core.usage"]
    settings = PROFILE_SETTINGS
    handlers = [SaveProfileHandler, CountProfileUseHandler]
    subcommands = (ProfileListSubcommand, SaveProfileSubcommand)
    listeners = [ProfilePublishListener]
    driver_rules = [ProfileUseRule]
    windows = [WindowDeclaration("profiles.profiles", "Agent profiles", "profiles.js", WindowLoading.COMPONENT, place=WindowPlace.PAGE, group="project", icon=WindowIcon.WORKER,
                                 reads=["profile list"], runs=["profile save"])]
