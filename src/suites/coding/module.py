from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from suites.coding.builder import Builder
from suites.coding.coding_suite import CodingSuite
from suites.coding.file_edit import FileEdit
from suites.coding.file_edit_record_handler import FileEditRecordHandler
from suites.coding.migrations.m001_file_edits import FileEditsTable
from suites.coding.orchestrator import Orchestrator
from suites.coding.orchestrator_start_guard import OrchestratorStartGuard
from suites.coding.record_file_edit import RecordFileEdit
from suites.coding.subagent import Subagent

FILE_EDIT_READS = ["file-edit list", "file-edit show"]


class CodingModule(Module):
    """Ships the coding suite with its drivers, the record of every file a coding agent edits, and its windows; the
    modules only coding uses live in its modules folder."""

    name = "journal.suites.coding"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents", "journal.core.drivers", "journal.core.tasks", "journal.core.plans", "journal.core.settings"]
    guards = [OrchestratorStartGuard]
    suites = [CodingSuite]
    drivers = [Builder, Orchestrator, Subagent]
    models = [ModelDeclaration(FileEdit, excluded_subcommands=["make", "edit"])]
    migrations = [FileEditsTable]
    handlers = [FileEditRecordHandler]
    driver_rules = [RecordFileEdit]
    windows = [WindowDeclaration("coding.file-feed", "File feed", "file-feed.js", WindowLoading.PAGE, place=WindowPlace.AGENT, reads=FILE_EDIT_READS,
                                 events=["file_edit.create"]),
               WindowDeclaration("coding.file-edits", "File edits", "file-edits.js", WindowLoading.PAGE, reads=[*FILE_EDIT_READS, "agent list"],
                                 events=["file_edit.create"]),
               WindowDeclaration("coding.terminal", "Terminal", "terminal.js", WindowLoading.PAGE, place=WindowPlace.AGENT)]
