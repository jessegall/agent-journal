from core.base.module.module import Module
from core.modules.helpers.commands.end_helper_job.end_helper_job_handler import EndHelperJobHandler
from core.modules.helpers.commands.send_helper.send_helper_handler import SendHelperHandler
from core.modules.helpers.commands.send_helper.send_helper_subcommand import SendHelperSubcommand
from core.modules.helpers.commands.start_helper.start_helper_handler import StartHelperHandler
from core.modules.helpers.commands.stop_helper.stop_helper_handler import StopHelperHandler
from core.modules.helpers.commands.stop_helper.stop_helper_subcommand import StopHelperSubcommand
from core.modules.helpers.listeners.helper_ended_listener import HelperEndedListener
from core.modules.helpers.commands.start_helper.start_helper_subcommand import StartHelperSubcommand
from core.modules.helpers.listeners.helper_program_listener import HelperProgramListener
from core.modules.helpers.rules.unstarted_helper_rule import UnstartedHelperRule
from core.modules.helpers.support.helper_settings import HELPER_SETTINGS


class HelpersModule(Module):
    """Starts and keeps helpers: extra agents the journal runs on any program, for a parent that hears from them by message."""

    name = "journal.core.helpers"
    seed_reason = "it keeps no rows of its own yet"
    move_reason = "version 4 had no helpers"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents", "journal.core.profiles", "journal.core.messages", "journal.core.drivers"]
    settings = HELPER_SETTINGS
    handlers = [StartHelperHandler, SendHelperHandler, StopHelperHandler, EndHelperJobHandler]
    subcommands = [StartHelperSubcommand, SendHelperSubcommand, StopHelperSubcommand]
    listeners = [HelperProgramListener, HelperEndedListener]
    driver_rules = [UnstartedHelperRule]
