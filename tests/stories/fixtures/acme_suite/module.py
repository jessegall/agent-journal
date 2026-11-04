from core.base.module.module import Module

from .acme_suite import AcmeSuite


class AcmeSuiteModule(Module):
    name = "acme.suite"
    requires_core = ">=5,<6"
    dependencies = ["journal.suites.coding"]
    suites = [AcmeSuite]
