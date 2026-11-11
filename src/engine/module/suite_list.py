from collections.abc import Sequence

from engine.driver.suite import Suite
from engine.helper_type.helper_type import HelperType
from engine.module.module import Module


class SuiteList:
    """The suites that are loaded, each with the modules it lists: answers which suites a module ships, which
    suite a module is part of, and which module is listed wrongly. The first module a suite lists is the
    suite's own module, which ships it. A plugin module that no suite lists still names its suites itself."""

    def __init__(self, suites: Sequence[type[Suite]]) -> None:
        self.suites = tuple(dict.fromkeys(suites))

    def modules(self) -> tuple[type[Module], ...]:
        return tuple(dict.fromkeys(module for suite in self.suites for module in suite.modules))

    def module_suites(self, module: type[Module]) -> list[type[Suite]]:
        return [*(suite for suite in self.suites if list(suite.modules[:1]) == [module]), *module.suites]

    def parent_name(self, module: type[Module]) -> str | None:
        listing = [suite.name for suite in self.suites if module in suite.modules[1:]]
        return listing[0] if listing else module.parent_suite

    def suite_names(self, module: type[Module]) -> tuple[str, ...]:
        names = (self.parent_name(module), *(suite.name for suite in self.module_suites(module)))
        return tuple(dict.fromkeys(name for name in names if name is not None))

    def helper_types(self, module: type[Module]) -> list[HelperType]:
        return [*module.helper_types, *(declaration for suite in self.module_suites(module) for declaration in suite.helper_types)]

    def problems(self) -> tuple[str, ...]:
        return (*self.modules_listed_twice(), *self.core_modules_listed(), *self.doubly_declared_modules())

    def modules_listed_twice(self) -> list[str]:
        problems = []
        for module in self.modules():
            listing = [suite.name for suite in self.suites if module in suite.modules]
            if len(listing) > 1:
                problems.append(f"module {module.name} is listed by suite {' and suite '.join(listing)}: one suite lists a module")
        return problems

    def core_modules_listed(self) -> list[str]:
        return [f"suite {suite.name} lists core module {module.name}: the core is always loaded, a suite lists its own modules"
                for suite in self.suites for module in suite.modules if module.__module__.startswith("core.modules.")]

    def doubly_declared_modules(self) -> list[str]:
        return [f"module {module.name} is listed by a suite and also names its suite itself: the list of the suite is the one place"
                for module in self.modules() if module.suites or module.parent_suite is not None]
