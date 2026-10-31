from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.waits.migrations.m001_waits import WaitsTablesMigration
from core.modules.waits.overlays.help_request_overlay import HelpRequestOverlay
from core.modules.waits.listeners.target_resolution_listener import TargetResolutionListener
from core.modules.waits.models.wait import Wait
from core.modules.waits.commands.end_wait import EndWait
from core.modules.waits.commands.wait_rows_subcommand import WaitRowsSubcommand
from core.modules.waits.commands.open_wait_handler import OpenWaitHandler
from core.modules.waits.commands.resume_wait import ResumeWait
from core.modules.waits.commands.help_request_subcommand import HelpRequestSubcommand
from core.modules.waits.models.wait_target import WaitTarget
from core.modules.waits.overlays.wait_overlay import WaitOverlay


class WaitsModule(Module):
    """Adds waits: an agent waits on rows it does not control or reports it is stuck, and while the wait is open it
    takes control of the agent as an exclusive overlay."""

    name = "journal.core.waits"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers"]
    models = [ModelDeclaration(Wait, commands=[EndWait, ResumeWait], excluded_subcommands=["make"]), ModelDeclaration(WaitTarget, excluded_subcommands=["make", "edit"])]
    migrations = [WaitsTablesMigration]
    handlers = [OpenWaitHandler]
    subcommands = [WaitRowsSubcommand, HelpRequestSubcommand]
    listeners = [TargetResolutionListener]
    overlays = [WaitOverlay, HelpRequestOverlay]
