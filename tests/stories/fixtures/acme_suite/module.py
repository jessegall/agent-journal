from engine.module.module import Module

from .acme_suite import AcmeSuite


class AcmeSuiteModule(Module):
    name = "acme.suite"
    requires_engine = ">=7,<8"
    dependencies = ["journal.suites.coding"]


class AcmeSuiteOfAcmeSuiteModule(AcmeSuite):
    modules = [AcmeSuiteModule]
