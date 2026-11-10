from suites.coding.coding_module import CodingModule
from suites.coding.coding_suite import CodingSuite
from suites.coding.modules.checks.checks_module import ChecksModule
from suites.coding.modules.workers.workers_module import WorkersModule

CodingSuite.modules = [CodingModule, WorkersModule, ChecksModule]
DEFAULT_SUITES = [CodingSuite]
