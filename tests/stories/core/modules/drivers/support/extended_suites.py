from engine.module.suite import Suite
from engine.module.module import Module

PATH = "tests.stories.core.modules.drivers.support.extended_suites"


class AcmeSuite(Suite):
    name = "acme"
    requires = ["coding"]


class AuditSuite(Suite):
    name = "audit"
    requires = ["coding"]


class AcmeModule(Module):
    name = "acme.suite"
    requires_core = ">=5,<6"
    dependencies = ["journal.suites.coding"]


class AuditModule(Module):
    name = "audit.suite"
    requires_core = ">=5,<6"
    dependencies = ["journal.suites.coding"]


class AcmeSuiteOfAcmeModule(AcmeSuite):
    modules = [AcmeModule]


class AuditSuiteOfAuditModule(AuditSuite):
    modules = [AuditModule]
