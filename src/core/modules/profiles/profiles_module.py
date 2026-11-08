from core.modules.profiles.commands.remove_profile.remove_profile_handler import RemoveProfileHandler
from core.modules.profiles.commands.remove_profile.remove_profile_subcommand import RemoveProfileSubcommand
from core.modules.profiles.commands.reset_profile.reset_profile_handler import ResetProfileHandler
from core.modules.profiles.commands.reset_profile.reset_profile_subcommand import ResetProfileSubcommand
from core.base.viewer.window_read_search import WindowReadSearch
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_key import WindowKey
from core.base.viewer.key_loading import KeyLoading
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.profiles.commands.count_profile_use.count_profile_use_handler import CountProfileUseHandler
from core.modules.profiles.commands.profile_list.profile_list_subcommand import ProfileListSubcommand
from core.modules.profiles.commands.profile_skills.profile_skills_subcommand import ProfileSkillsSubcommand
from core.modules.profiles.commands.save_profile.save_profile_handler import SaveProfileHandler
from core.modules.profiles.commands.save_profile.save_profile_subcommand import SaveProfileSubcommand
from core.modules.profiles.listeners.profile_publish_listener import ProfilePublishListener
from core.modules.profiles.support.profile_settings import PROFILE_SETTINGS
from core.modules.profiles.support.skeletons import PROFILES_PROFILES_SKELETON


class ProfilesModule(Module):
    """Publishes declared agent profiles and provides their list and editing commands."""

    name = "journal.core.profiles"
    seed_reason = "its rows are files the journal writes at every start"
    move_reason = "version 4's profiles are files that stay in place; their counts and settings move with the statistics and the settings"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.settings", "journal.core.drivers", "journal.core.usage", "journal.core.skills"]
    settings = PROFILE_SETTINGS
    handlers = [ResetProfileHandler, RemoveProfileHandler, SaveProfileHandler, CountProfileUseHandler]
    subcommands = [ResetProfileSubcommand, RemoveProfileSubcommand, ProfileListSubcommand, ProfileSkillsSubcommand, SaveProfileSubcommand]
    listeners = [ProfilePublishListener]
    windows = [WindowDeclaration("profiles.profiles", "Agent profiles", "profiles.js", WindowLoading.COMPONENT, skeleton=PROFILES_PROFILES_SKELETON, place=WindowPlace.PAGE, group="project", icon=WindowIcon.AGENT, search=WindowReadSearch("profile list", "Find a profile", ("name", "description", "agent_type", "model", "codex_model")),
                                 reads=["agent programs", "helper availability", "profile list", "profile skills"],
                                 keys=[WindowKey("programs", "agent programs"), WindowKey("profiles", "profile list"), WindowKey("skills", "profile skills", arguments=["profile"], loading=KeyLoading.REQUESTED), WindowKey("availability", "helper availability", arguments=["profile", "program"], loading=KeyLoading.REQUESTED)],
                                 runs=["helper start", "helper send", "profile save", "profile reset", "profile remove"])]
