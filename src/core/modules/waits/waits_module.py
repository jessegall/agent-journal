from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.waits.migrations.m001_waits import WaitsTablesMigration
from core.modules.waits.overlays.help_request_overlay import HelpRequestOverlay
from core.modules.waits.listeners.target_resolution_listener import TargetResolutionListener
from core.modules.waits.models.wait import Wait
from core.modules.waits.listeners.impasse_mark_listener import ImpasseMarkListener
from core.modules.waits.support.wait_marks import WAIT_MARKS
from core.modules.waits.commands.end_wait import EndWait
from core.modules.waits.commands.open_wait_subcommand import OpenWaitSubcommand
from core.modules.waits.commands.open_wait_handler import OpenWaitHandler
from core.modules.waits.commands.resume_wait import ResumeWait
from core.modules.waits.commands.request_help_subcommand import RequestHelpSubcommand
from core.modules.waits.models.wait_target import WaitTarget
from core.modules.waits.overlays.wait_overlay import WaitOverlay
from core.modules.waits.seeders.waits_seeder import WaitsSeeder


class WaitsModule(Module):
    """Adds waits: an agent waits on rows it does not control or reports it is stuck, and while the wait
    is open it takes control of the agent as an exclusive overlay."""

    name = "journal.core.waits"
    move_reason = "version 4 had no table for waits"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers", "journal.core.chat"]
    models = [ModelDeclaration(Wait, commands=[EndWait, ResumeWait], excluded_subcommands=["make"]), ModelDeclaration(WaitTarget, excluded_subcommands=["make", "edit"])]
    migrations = [WaitsTablesMigration]
    handlers = [OpenWaitHandler]
    subcommands = [OpenWaitSubcommand, RequestHelpSubcommand]
    listeners = [TargetResolutionListener, ImpasseMarkListener]
    marks = WAIT_MARKS
    overlays = [WaitOverlay, HelpRequestOverlay]
    seeders = [WaitsSeeder]
