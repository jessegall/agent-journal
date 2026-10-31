from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.dumps.commands.dump_items_subcommand import DumpItemsSubcommand
from core.modules.dumps.commands.failed_item_subcommand import FailedItemSubcommand
from core.modules.dumps.commands.filed_item_subcommand import FiledItemSubcommand
from core.modules.dumps.commands.make_dump_handler import MakeDumpHandler
from core.modules.dumps.commands.make_dump_subcommand import MakeDumpSubcommand
from core.modules.dumps.commands.move_dump_item_handler import MoveDumpItemHandler
from core.modules.dumps.commands.name_dump_handler import NameDumpHandler
from core.modules.dumps.commands.name_dump_subcommand import NameDumpSubcommand
from core.modules.dumps.commands.note_item_subcommand import NoteItemSubcommand
from core.modules.dumps.listeners.dump_dock_listener import DumpDockListener
from core.modules.dumps.migrations.m001_dumps import DumpsTablesMigration
from core.modules.dumps.models.dump import Dump
from core.modules.dumps.models.dump_item import DumpItem
from core.modules.dumps.seeders.dumps_seeder import DumpsSeeder
from core.modules.dumps.support.dump_docks import DUMP_DOCKS

BUILT = ["make", "edit", "delete"]


class DumpsModule(Module):
    """Adds dumps: notes and files the user pours in, which the agent makes rows from, item by item."""

    name = "journal.core.dumps"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.docking"]
    models = [ModelDeclaration(Dump, excluded_subcommands=BUILT), ModelDeclaration(DumpItem, excluded_subcommands=BUILT)]
    migrations = [DumpsTablesMigration]
    handlers = [MakeDumpHandler, MoveDumpItemHandler, NameDumpHandler]
    subcommands = (MakeDumpSubcommand, DumpItemsSubcommand, NoteItemSubcommand, FiledItemSubcommand, FailedItemSubcommand, NameDumpSubcommand)
    listeners = [DumpDockListener]
    docks = DUMP_DOCKS
    windows = [WindowDeclaration("dumps.dumps", "Dumps", "dumps.js", WindowLoading.COMPONENT, icon=WindowIcon.FILED, reads=["dump list", "dump-item list"],
                                 events=["dump.*", "dump_item.*"])]
    seeders = [DumpsSeeder]
