from core.modules.helpers.types.helper import Helper
from engine.event.created import Created
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.drivers.support.command_admission import CommandAdmission
from core.modules.helpers.commands.start_helper.start_helper import StartHelper
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.support.coding_main_options import CodingMainOptions
from suites.coding.support.main_caller import MainCaller

DESIGNER_PROFILE = "journal-designer"


class ReadonlyHelperStartGuard(Guard[Created[Agent]]):
    """A main agent starts no designer while the designer is off, and no read-only helper while read-only helpers
    are off, which an agent's start asks of the hook's policy (doc 1310 section 10.9). The merger is governed by its
    own setting."""

    name = "workers.main-starts-no-helper"

    def __init__(self, caller: MainCaller, options: CodingMainOptions, admission: CommandAdmission) -> None:
        self.caller, self.options, self.admission = caller, options, admission

    def check(self, event: Created[Agent], context: Context) -> None:
        if event.row.role != Helper.key or not self.caller.is_main(context):
            return
        options = self.options.options()
        if event.row.profile == DESIGNER_PROFILE and not options.designer:
            raise Refusal("the main agent starts no designer here", "a user turns on journal.suites.coding.designer-enabled")
        if self.admission.answers(context):
            self.admission.admit(StartHelper, context)
            return
        if event.row.profile != DESIGNER_PROFILE and not options.helpers:
            raise Refusal("the main agent starts no read-only helper here", "a user turns on journal.suites.coding.main-starts-read-only-helpers")
