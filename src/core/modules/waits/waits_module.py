from core.modules.waits.migrations.m004_wait_session import WaitSessionMigration
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.waits.migrations.m001_waits import WaitsTablesMigration
from core.modules.waits.migrations.m002_wait_target_wait_index import WaitTargetWaitIndexMigration
from core.modules.waits.migrations.m003_pending_targets_index import PendingTargetsIndexMigration
from core.modules.waits.migrations.m005_open_wait_index import OpenWaitIndexMigration
from core.modules.waits.models.waiting_row import WaitingRow
from core.modules.waits.commands.waiting_wait.waiting_wait_subcommand import WaitingWaitSubcommand
from core.modules.waits.overlays.help_request_overlay import HelpRequestOverlay
from core.modules.waits.listeners.target_resolution_listener import TargetResolutionListener
from core.modules.waits.models.wait import Wait
from core.modules.waits.listeners.reported_wait_mark_listener import ReportedWaitMarkListener
from core.modules.waits.listeners.wait_end_listener import WaitEndListener
from core.modules.waits.support.wait_nudges import WAIT_NUDGES
from core.modules.waits.support.wait_marks import WAIT_MARKS
from core.modules.waits.commands.end_wait.end_wait import EndWait
from core.modules.waits.commands.open_wait.open_wait_subcommand import OpenWaitSubcommand
from core.modules.waits.commands.open_wait.open_wait_handler import OpenWaitHandler
from core.modules.waits.commands.resume_wait.resume_wait import ResumeWait
from core.modules.waits.commands.request_help.request_help_subcommand import RequestHelpSubcommand
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
    migrations = [WaitSessionMigration, WaitsTablesMigration, WaitTargetWaitIndexMigration, PendingTargetsIndexMigration, OpenWaitIndexMigration]
    views = [WaitingRow]
    handlers = [OpenWaitHandler]
    subcommands = [OpenWaitSubcommand, RequestHelpSubcommand, WaitingWaitSubcommand]
    listeners = [TargetResolutionListener, ReportedWaitMarkListener, WaitEndListener]
    nudges = WAIT_NUDGES
    marks = WAIT_MARKS
    overlays = [WaitOverlay, HelpRequestOverlay]
    seeders = [WaitsSeeder]
