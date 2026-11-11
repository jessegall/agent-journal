from engine.module.suite import Suite
from engine.module.module import Module

PATH = "tests.stories.core.modules.drivers.support.module_memberships"


class AcmeSuite(Suite):
    name = "acme"


class SuiteModule(Module):
    name = "acme.suite"
    requires_core = ">=5,<6"
    parent_suite = "coding"
    dependencies = ["journal.suites.coding"]
    suites = [AcmeSuite]


class MemberModule(Module):
    name = "acme.member"
    requires_core = ">=5,<6"
    parent_suite = "acme"
    dependencies = ["acme.suite"]


class UnknownSuiteModule(Module):
    name = "acme.unknown"
    requires_core = ">=5,<6"
    parent_suite = "absent"


class MissingDependencyModule(Module):
    name = "acme.independent"
    requires_core = ">=5,<6"
    parent_suite = "coding"
