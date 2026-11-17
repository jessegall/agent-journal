from core.modules.dumps.declarations.dumps_dependencies import DUMPS_DEPENDENCIES
from core.modules.dumps.declarations.dumps_subcommands import DUMPS_SUBCOMMANDS
from core.modules.dumps.wake_causes.dump_arrived_wake import DumpArrivedWake
from core.modules.dumps.lines.open_dump_lines import OpenDumpLines
from core.modules.dumps.windows.dumps_windows import DUMPS_WINDOWS
from core.modules.dumps.models.declarations.dump_model_declaration import DumpModelDeclaration
from core.modules.dumps.models.declarations.dump_item_model_declaration import DumpItemModelDeclaration
from core.modules.dumps.docks.dumps_docks import DUMPS_DOCKS
from core.modules.dumps.skills.declarations.dumps_skills import DUMPS_SKILLS
from core.modules.dumps.migrations.m003_dump_closed_index import DumpClosedIndexMigration
from engine.module.module import Module
from core.modules.dumps.models.dump_row import DumpRow
from core.modules.dumps.commands.make_dump.make_dump_handler import MakeDumpHandler
from core.modules.dumps.commands.move_dump_item.move_dump_item_handler import MoveDumpItemHandler
from core.modules.dumps.commands.name_dump.name_dump_handler import NameDumpHandler
from core.modules.dumps.listeners.dump_arrival_listener import DumpArrivalListener
from core.modules.dumps.support.dump_agent_messages import DUMP_AGENT_MESSAGES
from core.modules.dumps.listeners.dump_dock_listener import DumpDockListener
from core.modules.dumps.migrations.m001_dumps import DumpsTablesMigration
from core.modules.dumps.migrations.m002_project_dumps import ProjectDumpsMigration
from core.modules.dumps.upgrade.dumps_move import DumpsMove
from core.modules.dumps.seeders.dumps_seeder import DumpsSeeder


class DumpsModule(Module):
    """Adds dumps: notes and files the user adds, which the agent makes rows from, item by item."""

    name = "journal.core.dumps"
    lines = [OpenDumpLines]
    requires_engine = ">=7,<8"
    dependencies = DUMPS_DEPENDENCIES
    skills = DUMPS_SKILLS
    models = [DumpModelDeclaration, DumpItemModelDeclaration]
    migrations = [DumpClosedIndexMigration, DumpsTablesMigration, ProjectDumpsMigration]
    moves = [DumpsMove]
    handlers = [MakeDumpHandler, MoveDumpItemHandler, NameDumpHandler]
    views = [DumpRow]
    subcommands = DUMPS_SUBCOMMANDS
    agent_messages = DUMP_AGENT_MESSAGES
    listeners = [DumpArrivalListener, DumpDockListener]
    wake_causes = [DumpArrivedWake]
    docks = DUMPS_DOCKS
    windows = DUMPS_WINDOWS
    seeders = [DumpsSeeder]
