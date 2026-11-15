from engine.module.module import Module
from core.modules.demo.commands.demo_seed.demo_seed_subcommand import DemoSeedSubcommand
from core.modules.demo.commands.demo_start.demo_start_subcommand import DemoStartSubcommand
from core.modules.demo.tick_handlers.demo_folder_pruning_tick_handler import DemoFolderPruningTickHandler
from core.modules.demo.tick_handlers.demo_owner_watch_tick_handler import DemoOwnerWatchTickHandler


class DemoModule(Module):
    """Adds the demo: a journal filled by the seeders of the modules, and a scratch server that shows it."""

    name = "journal.core.demo"
    seed_reason = "it is the module that runs the seeders"
    move_reason = "version 4 had no demo rows"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.actors"]
    subcommands = [DemoSeedSubcommand, DemoStartSubcommand]
    tick_handlers = [DemoFolderPruningTickHandler,
                     DemoOwnerWatchTickHandler]
