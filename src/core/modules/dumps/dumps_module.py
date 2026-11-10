from core.modules.dumps.migrations.m003_dump_closed_index import DumpClosedIndexMigration
from engine.skill.skill_declaration import SkillDeclaration
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from engine.viewer.window_search import WindowSearch
from core.modules.dumps.support.dump_searcher import DumpSearcher
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_key import WindowKey
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.dumps.commands.dump_board.dump_board_subcommand import DumpBoardSubcommand
from core.modules.dumps.commands.dump_board.dump_item_board_subcommand import DumpItemBoardSubcommand
from core.modules.dumps.commands.dump_items.dump_items_subcommand import DumpItemsSubcommand
from core.modules.dumps.models.dump_row import DumpRow
from core.modules.dumps.commands.fail_dump_item.fail_dump_item_subcommand import FailDumpItemSubcommand
from core.modules.dumps.commands.file_dump_item.file_dump_item_subcommand import FileDumpItemSubcommand
from core.modules.dumps.commands.make_dump.make_dump_handler import MakeDumpHandler
from core.modules.dumps.commands.make_dump.make_dump_subcommand import MakeDumpSubcommand
from core.modules.dumps.commands.move_dump_item.move_dump_item_handler import MoveDumpItemHandler
from core.modules.dumps.commands.name_dump.name_dump_handler import NameDumpHandler
from core.modules.dumps.commands.name_dump.name_dump_subcommand import NameDumpSubcommand
from core.modules.dumps.commands.note_item.note_item_subcommand import NoteItemSubcommand
from core.modules.dumps.listeners.dump_arrival_listener import DumpArrivalListener
from core.modules.dumps.rules.open_dump_rule import OpenDumpRule
from core.modules.dumps.support.dump_nudges import DUMP_NUDGES
from core.modules.dumps.listeners.dump_dock_listener import DumpDockListener
from core.modules.dumps.migrations.m001_dumps import DumpsTablesMigration
from core.modules.dumps.migrations.m002_project_dumps import ProjectDumpsMigration
from core.modules.dumps.models.dump import Dump
from core.modules.dumps.models.dump_item import DumpItem
from core.modules.dumps.upgrade.dumps_move import DumpsMove
from core.modules.dumps.seeders.dumps_seeder import DumpsSeeder
from core.modules.dumps.support.dump_docks import DUMP_DOCKS
from core.modules.dumps.support.skeletons import DUMPS_DUMPS_SKELETON

BUILT = ["make", "edit", "delete"]


class DumpsModule(Module):
    """Adds dumps: notes and files the user adds, which the agent makes rows from, item by item."""

    name = "journal.core.dumps"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.docking", "journal.core.agents", "journal.core.drivers"]
    skills = [SkillDeclaration("journal-dumps", "File what the user dropped in a dump by sorting the material by subject into rows of their own; read it when a dump arrives", keywords=("dump", "dumps", "dumped"), commands=["dump"], types=["main"])]
    models = [ModelDeclaration(Dump, excluded_subcommands=BUILT), ModelDeclaration(DumpItem, excluded_subcommands=BUILT)]
    migrations = [DumpClosedIndexMigration, DumpsTablesMigration, ProjectDumpsMigration]
    moves = [DumpsMove]
    handlers = [MakeDumpHandler, MoveDumpItemHandler, NameDumpHandler]
    views = [DumpRow]
    subcommands = [DumpBoardSubcommand, DumpItemBoardSubcommand, MakeDumpSubcommand, DumpItemsSubcommand, NoteItemSubcommand, FileDumpItemSubcommand, FailDumpItemSubcommand, NameDumpSubcommand]
    nudges = DUMP_NUDGES
    driver_rules = [OpenDumpRule]
    listeners = [DumpArrivalListener, DumpDockListener]
    docks = DUMP_DOCKS
    windows = [WindowDeclaration("dumps.dumps", "Dumps", "dumps.js", WindowLoading.COMPONENT, skeleton=DUMPS_DUMPS_SKELETON, search=WindowSearch(DumpSearcher, "Search the dumps"), place=WindowPlace.PANE, icon=WindowIcon.FILED, reads=["dump board", "dump-item board"],
                                 runs=["dump name"], events=["dump.*", "dump_item.*"],
                                 keys=[WindowKey("dumps", "dump board", arguments=["before"], events=["dump.*", "dump_item.*"])])]
    seeders = [DumpsSeeder]
