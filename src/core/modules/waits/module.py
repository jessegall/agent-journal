from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.waits.migrations.m001_waits import WaitsTablesMigration
from core.modules.waits.help_request_overlay import HelpRequestOverlay
from core.modules.waits.target_resolution_listener import TargetResolutionListener
from core.modules.waits.wait import Wait
from core.modules.waits.wait_end import WaitEnd
from core.modules.waits.wait_rows_subcommand import WaitRowsSubcommand
from core.modules.waits.wait_open_handler import WaitOpenHandler
from core.modules.waits.wait_resume import WaitResume
from core.modules.waits.help_request_subcommand import HelpRequestSubcommand
from core.modules.waits.wait_target import WaitTarget
from core.modules.waits.wait_overlay import WaitOverlay


class WaitsModule(Module):
    """Adds waits: an agent waits on rows it does not control or reports it is stuck, and while the wait is open it
    takes control of the agent as an exclusive overlay."""

    name = "journal.core.waits"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers"]
    models = [ModelDeclaration(Wait, commands=[WaitEnd, WaitResume], excluded_subcommands=["make"]), ModelDeclaration(WaitTarget, excluded_subcommands=["make", "edit"])]
    migrations = [WaitsTablesMigration]
    handlers = [WaitOpenHandler]
    subcommands = [WaitRowsSubcommand, HelpRequestSubcommand]
    listeners = [TargetResolutionListener]
    overlays = [WaitOverlay, HelpRequestOverlay]
