from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.driver.driver import Driver
from suites.coding.support.coding_suite_name import CODING_SUITE_NAME
from suites.coding.support.context_line import CONTEXT_LINE


class HelperDriver(Driver):
    """Drives a helper the coding suite's agents start, which reads and reports."""

    name = "coding.helper"
    suite_name = CODING_SUITE_NAME
    role = CodingHelperRole.HELPER
    rules = []
    opening_lines = [CONTEXT_LINE]
