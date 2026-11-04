from core.base.driver.suite import Suite
from core.base.module.module import Module

PATH = "tests.stories.core.modules.drivers.support.module_memberships"


class AcmeSuite(Suite):
    name = "acme"


class SuiteModule(Module):
    name = "acme.suite"
    requires_core = ">=5,<6"
    part_of = ["coding"]
    dependencies = ["journal.suites.coding"]
    suites = [AcmeSuite]


class MemberModule(Module):
    name = "acme.member"
    requires_core = ">=5,<6"
    part_of = ["acme"]
    dependencies = ["acme.suite"]


class UnknownSuiteModule(Module):
    name = "acme.unknown"
    requires_core = ">=5,<6"
    part_of = ["absent"]


class MissingDependencyModule(Module):
    name = "acme.independent"
    requires_core = ">=5,<6"
    part_of = ["coding"]
