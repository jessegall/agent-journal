from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.toggle_option import ToggleOption
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from suites.coding.drivers.builder.builder_driver import BuilderDriver
from suites.coding.coding_suite import CodingSuite
from suites.coding.models.file_edit import FileEdit
from suites.coding.commands.record_file_edit_handler import RecordFileEditHandler
from suites.coding.migrations.m001_file_edits import FileEditsTableMigration
from suites.coding.drivers.orchestrator.orchestrator_driver import OrchestratorDriver
from suites.coding.drivers.orchestrator.guards.orchestrator_start_guard import OrchestratorStartGuard
from suites.coding.rules.record_file_edit_rule import RecordFileEditRule
from suites.coding.drivers.subagent.subagent_driver import SubagentDriver

FILE_EDIT_READS = ["file-edit list", "file-edit show"]


class CodingModule(Module):
    """Ships the coding suite with its drivers, the record of every file a coding agent edits, and its windows; the
    modules only coding uses live in its modules folder."""

    name = "journal.suites.coding"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents", "journal.core.drivers", "journal.core.tasks", "journal.core.plans", "journal.core.settings"]
    guards = [OrchestratorStartGuard]
    suites = [CodingSuite]
    drivers = [BuilderDriver, OrchestratorDriver, SubagentDriver]
    models = [ModelDeclaration(FileEdit, excluded_subcommands=["make", "edit"])]
    migrations = [FileEditsTableMigration]
    handlers = [RecordFileEditHandler]
    driver_rules = [RecordFileEditRule]
    windows = [WindowDeclaration("coding.file-feed", "File feed", "file-feed.js", WindowLoading.COMPONENT, icon=WindowIcon.FILE, options=[ToggleOption("flush", "Flush")], place=WindowPlace.AGENT, reads=FILE_EDIT_READS,
                                 events=["file_edit.create"]),
               WindowDeclaration("coding.file-edits", "File edits", "file-edits.js", WindowLoading.COMPONENT, icon=WindowIcon.COMMIT, reads=[*FILE_EDIT_READS, "agent list"],
                                 events=["file_edit.create"]),
               WindowDeclaration("coding.terminal", "Terminal", "terminal.js", WindowLoading.COMPONENT, icon=WindowIcon.TERMINAL, place=WindowPlace.AGENT)]
