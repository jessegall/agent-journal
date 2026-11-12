from engine.module.suite import Suite
from tests.stories.core.modules.viewer.support.acme_buttons_module import AcmeButtonsModule

PATH = "tests.stories.core.modules.viewer.support.coding_acme_buttons_module:CodingAcmeButtonsModuleJoining"


class CodingAcmeButtonsModule(AcmeButtonsModule):
    dependencies = [*AcmeButtonsModule.dependencies, "journal.suites.coding"]


class CodingAcmeButtonsModuleJoining(Suite):
    name = "CodingAcmeButtonsModule"
    joins = "coding"
    modules = [CodingAcmeButtonsModule]
