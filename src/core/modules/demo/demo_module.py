from engine.module.module import Module
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.demo.commands.demo_seed.demo_seed_subcommand import DemoSeedSubcommand
from core.modules.demo.commands.demo_start.demo_start_subcommand import DemoStartSubcommand
from core.modules.demo.ticks.demo_folder_pruning import DemoFolderPruning


class DemoModule(Module):
    """Adds the demo: a journal filled by the seeders of the modules, and a scratch server that shows it."""

    name = "journal.core.demo"
    seed_reason = "it is the module that runs the seeders"
    move_reason = "version 4 had no demo rows"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors"]
    subcommands = [DemoSeedSubcommand, DemoStartSubcommand]
    tick_handlers = [TickHandler(TickInterval(seconds=15 * 60), DemoFolderPruning(), "demo folder pruning")]
