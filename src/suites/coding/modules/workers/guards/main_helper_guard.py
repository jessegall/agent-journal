from core.base.change.created import Created
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.support.merger_nudges import MERGER_PROFILE
from suites.coding.support.coding_helper_kind import CodingHelperKind
from suites.coding.support.coding_main_options import CodingMainOptions
from suites.coding.support.main_caller import MainCaller

DESIGNER_PROFILE = "journal-designer"


class MainHelperGuard(Guard[Created[Agent]]):
    """A main agent starts no read-only helper while read-only helpers are off, and no designer while the designer is off.
    The merger is governed by its own setting."""

    name = "workers.main-starts-no-helper"

    def __init__(self, caller: MainCaller, options: CodingMainOptions) -> None:
        self.caller, self.options = caller, options

    def check(self, event: Created[Agent], context: Context) -> None:
        if event.row.role != CodingHelperKind.READ_ONLY or event.row.profile == MERGER_PROFILE or not self.caller.is_main(context):
            return
        options = self.options.options()
        if event.row.profile == DESIGNER_PROFILE and not options.designer:
            raise Refusal("the main agent starts no designer here", "a person turns on journal.suites.coding.designer-enabled")
        if event.row.profile != DESIGNER_PROFILE and not options.helpers:
            raise Refusal("the main agent starts no read-only helper here", "a person turns on journal.suites.coding.main-starts-read-only-helpers")
