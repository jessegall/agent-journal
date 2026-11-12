from engine.module.suite import Suite
from engine.module.module import Module

PATH = "tests.stories.core.modules.drivers.support.module_memberships"


class AcmeSuite(Suite):
    name = "acme"


class SuiteModule(Module):
    name = "acme.suite"
    requires_core = ">=5,<6"
    dependencies = ["journal.suites.coding"]


class MemberModule(Module):
    name = "acme.member"
    requires_core = ">=5,<6"
    dependencies = ["acme.suite"]


class UnknownSuiteModule(Module):
    name = "acme.unknown"
    requires_core = ">=5,<6"


class MissingDependencyModule(Module):
    name = "acme.independent"
    requires_core = ">=5,<6"


class SuiteModuleJoining(Suite):
    name = "acme.suite"
    joins = "coding"
    modules = [SuiteModule]


class AcmeSuiteOfSuiteModule(AcmeSuite):
    modules = [SuiteModule]


class MemberModuleJoining(Suite):
    name = "acme.member"
    joins = "acme"
    modules = [MemberModule]


class UnknownSuiteModuleJoining(Suite):
    name = "acme.unknown"
    joins = "absent"
    modules = [UnknownSuiteModule]


class MissingDependencyModuleJoining(Suite):
    name = "acme.independent"
    joins = "coding"
    modules = [MissingDependencyModule]
