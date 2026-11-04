from tests.stories.core.modules.viewer.support.acme_buttons_module import AcmeButtonsModule

PATH = "tests.stories.core.modules.viewer.support.coding_acme_buttons_module:CodingAcmeButtonsModule"


class CodingAcmeButtonsModule(AcmeButtonsModule):
    parent_suite = "coding"
    dependencies = [*AcmeButtonsModule.dependencies, "journal.suites.coding"]
