from engine.module.module import Module

from .acme_suite import AcmeSuite


class AcmeSuiteModule(Module):
    name = "acme.suite"
    requires_engine = ">=6,<7"
    dependencies = ["journal.suites.coding"]


class AcmeSuiteOfAcmeSuiteModule(AcmeSuite):
    modules = [AcmeSuiteModule]
