from core.base.module.model_declaration import ModelDeclaration
from core.modules.viewer.migrations.m003_helpers_window_key import HelpersWindowKeyMigration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_key import WindowKey
from core.base.viewer.key_loading import KeyLoading
from core.modules.viewer.migrations.m001_viewer import ViewerTablesMigration
from core.modules.viewer.migrations.m002_person_presets import PersonPresetsMigration
from core.modules.viewer.commands.person_preset_list.person_preset_list_subcommand import PersonPresetListSubcommand
from core.modules.viewer.commands.remove_person_preset.remove_person_preset_handler import RemovePersonPresetHandler
from core.modules.viewer.commands.remove_person_preset.remove_person_preset_subcommand import RemovePersonPresetSubcommand
from core.modules.viewer.commands.rename_person_preset.rename_person_preset_handler import RenamePersonPresetHandler
from core.modules.viewer.commands.rename_person_preset.rename_person_preset_subcommand import RenamePersonPresetSubcommand
from core.modules.viewer.commands.save_person_preset.save_person_preset_handler import SavePersonPresetHandler
from core.modules.viewer.commands.save_person_preset.save_person_preset_subcommand import SavePersonPresetSubcommand
from core.modules.viewer.guards.person_preset_owner_guard import PersonPresetOwnerGuard
from core.modules.viewer.models.person_preset import PersonPreset
from core.modules.viewer.guards.permission_owner_guard import PermissionOwnerGuard
from core.modules.viewer.guards.layout_owner_guard import LayoutOwnerGuard
from core.modules.viewer.listeners.permission_pruner_listener import PermissionPrunerListener
from core.modules.viewer.commands.save_viewer_layout.save_viewer_layout_handler import SaveViewerLayoutHandler
from core.modules.viewer.commands.save_viewer_layout.save_viewer_layout_subcommand import SaveViewerLayoutSubcommand
from core.modules.viewer.commands.viewer_layout_current.viewer_layout_current_subcommand import ViewerLayoutCurrentSubcommand
from core.modules.viewer.commands.allow_window.allow_window_handler import AllowWindowHandler
from core.modules.viewer.commands.save_window_setting.save_window_setting_handler import SaveWindowSettingHandler
from core.modules.viewer.commands.save_window_setting.save_window_setting_subcommand import SaveWindowSettingSubcommand
from core.modules.viewer.commands.allow_window.allow_window_subcommand import AllowWindowSubcommand
from core.modules.viewer.commands.prune_window_permissions.prune_window_permissions_handler import PruneWindowPermissionsHandler
from core.modules.viewer.commands.window_permissions.window_permissions_subcommand import WindowPermissionsSubcommand
from core.modules.viewer.commands.window_search.window_search_subcommand import WindowSearchSubcommand
from core.modules.viewer.commands.window_setting.window_setting_subcommand import WindowSettingSubcommand
from core.modules.viewer.commands.trust_window.trust_window_handler import TrustWindowHandler
from core.modules.viewer.commands.trust_window.trust_window_subcommand import TrustWindowSubcommand
from core.modules.viewer.models.viewer_layout import ViewerLayout
from core.modules.viewer.models.window_permission import WindowPermission
from core.modules.viewer.commands.support.window_setting_keys import VIEWER_SETTINGS
from core.modules.viewer.support.skeletons import VIEWER_SHELL_SKELETON

SHELL_RUNS = ["doc comment", "report comment", "plan comment", "task comment", "message send", "link remove", "doc edit", "report edit", "doc close", "doc settle", "report close", "agent pause", "agent resume", "agent control", "agent stop", "agent launch", "task edit", "question answer", "question close", "setting make", "setting set", "plan ready", "plan start", "plan block", "plan unblock", "plan close", "plan cancel", "task start", "task block", "task unblock",
              "task retest", "task close", "task cancel", "task reopen", "environment make", "update install", "viewer-layout save", "window allow", "person-preset save", "person-preset rename", "person-preset remove", "memory-keyword make", "memory-keyword delete"]
SHELL_READS = ["agent environments", "agent main", "output list", "pin list", "agent-skill list", "doc inspect", "report inspect", "doc comments", "report comments", "plan comments", "task comments", "template list", "doc revisions", "doc revision", "link list", "phone list", "agent controls", "agent programs", "update check", "task inspect", "task graph", "plan place", "plan inspect", "plan timeline", "environment list", "environment show", "agent list", "agent show", "actor show", "setting list", "setting show", "viewer-layout current",
               "window permissions", "suite current", "suite layout", "suite presets", "person-preset list", "event list", "task list", "question list", "usage show", "usage bars", "usage agent", "usage agents", "usage tool", "plan show", "plan outline", "plan board", "task board", "phase list", "phase-task list", "task show", "task-log list", "task-dependency list",
               "doc show", "report show", "question show", "suggestion show", "message show", "memory show", "rule show", "process show", "output show", "review show", "sequence show",
               "template show", "dump show", "skill show", "usage fitness", "memory-keyword list", "output peek", "output page", "queue inspect", "queue list"]


class ViewerModule(Module):
    """Adds the viewer: the window the shell itself runs its lines as, the check of every line a window sends,
    each person's layouts and the permissions each person gives a window."""

    name = "journal.core.viewer"
    seed_reason = "a person's layouts and presets are made by using the viewer"
    requires_core = ">=5,<6"
    settings = VIEWER_SETTINGS
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.settings", "journal.core.drivers"]
    models = [ModelDeclaration(ViewerLayout, excluded_subcommands=["make", "edit"]), ModelDeclaration(PersonPreset, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(WindowPermission, excluded_subcommands=["edit"])]
    move_reason = "each suite carries the layouts of the application it replaces"
    migrations = [ViewerTablesMigration, PersonPresetsMigration, HelpersWindowKeyMigration]
    handlers = [SaveViewerLayoutHandler, SavePersonPresetHandler, RenamePersonPresetHandler, RemovePersonPresetHandler, AllowWindowHandler, TrustWindowHandler, PruneWindowPermissionsHandler, SaveWindowSettingHandler]
    subcommands = [SaveViewerLayoutSubcommand, SavePersonPresetSubcommand, RenamePersonPresetSubcommand, RemovePersonPresetSubcommand, PersonPresetListSubcommand, ViewerLayoutCurrentSubcommand, AllowWindowSubcommand, TrustWindowSubcommand, WindowPermissionsSubcommand,
                   SaveWindowSettingSubcommand, WindowSettingSubcommand, WindowSearchSubcommand]
    guards = [PermissionOwnerGuard, LayoutOwnerGuard, PersonPresetOwnerGuard]
    listeners = [PermissionPrunerListener]
    windows = [WindowDeclaration("viewer.shell", "Viewer", "index.html", WindowLoading.COMPONENT, skeleton=VIEWER_SHELL_SKELETON, icon=WindowIcon.WINDOW, reads=SHELL_READS, runs=SHELL_RUNS, events=["process.*", "output.*", "setting.*", "agent.*", "phone.*", "task.*", "question.*", "scheduled_job.*"], keys=[
        WindowKey("environments", "environment list"),
        WindowKey("active-environments", "agent environments", events=["agent.*"]),
        WindowKey("usage", "usage show", reload_seconds=10),
        WindowKey("fitness", "usage fitness", arguments=["agent"], loading=KeyLoading.REQUESTED),
        WindowKey("phones", "phone list", events=["phone.*"]),
        WindowKey("bars", "usage bars"),
        WindowKey("activity", "event list --limit 30", tab="activity", reload_seconds=5),
        WindowKey("update", "update check"),
        WindowKey("pins", "pin list", loading=KeyLoading.REQUESTED),
        WindowKey("suite-presets", "suite presets {environment} {page}"),
        WindowKey("person-presets", "person-preset list", arguments=["page"]),
    ])]
