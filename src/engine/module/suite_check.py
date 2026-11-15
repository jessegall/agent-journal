from collections.abc import Mapping, Sequence

from engine.module.module import Module
from engine.module.name_groups import NameGroups
from engine.module.suite_list import SuiteList
from engine.viewer.layout_shape import layout_windows


class SuiteCheck:
    """Checks the suites and drivers before a sync writes: names, requirements, suites reached through
    dependencies, defaults that fit their role and suite, and presets that show only the suite's windows
    under keys of their own."""

    def problems(self, modules: Sequence[type[Module]], suites: SuiteList) -> tuple[str, ...]:
        return (suites.problems() + self.duplicates(modules, suites) + self.unknown_requirements(modules, suites) + self.requirement_loops(modules, suites)
                + self.driver_suites(modules, suites) + self.wrong_suite_drivers(modules) + self.preset_problems(modules, suites)
                + self.module_memberships(modules, suites))

    def module_memberships(self, modules: Sequence[type[Module]], suites: SuiteList) -> tuple[str, ...]:
        owners = self.suite_modules(modules, suites)
        problems: list[str] = []
        for module in modules:
            suite = suites.parent_name(module)
            if suite is None:
                continue
            if suite not in owners:
                problems.append(f"module {module.name} is part of suite {suite}: install the module that ships it first")
                continue
            if owners[suite] not in {module.name, *module.dependencies}:
                problems.append(f"module {module.name} is part of suite {suite} of module {owners[suite]}, "
                                "which it does not depend on")
        return tuple(problems)

    def suite_modules(self, modules: Sequence[type[Module]], suites: SuiteList) -> Mapping[str, str]:
        return {suite.name: module.name for module in modules for suite in suites.module_suites(module)}

    def duplicates(self, modules: Sequence[type[Module]], suites: SuiteList) -> tuple[str, ...]:
        groups = (("suites", [suite.name for module in modules for suite in suites.module_suites(module)]), ("drivers", [driver.name for module in modules for driver in module.drivers]))
        return NameGroups.duplicates(groups)

    def unknown_requirements(self, modules: Sequence[type[Module]], suites: SuiteList) -> tuple[str, ...]:
        shipped = self.suite_modules(modules, suites)
        return tuple(f"suite {suite.name} requires suite {required}: install the module that ships it first"
                     for module in modules for suite in suites.module_suites(module) for required in suite.requires if required not in shipped)

    def requirement_loops(self, modules: Sequence[type[Module]], suites: SuiteList) -> tuple[str, ...]:
        requires = {suite.name: tuple(suite.requires) for module in modules for suite in suites.module_suites(module)}
        return tuple(f"suite {name} requires itself through {' -> '.join(path)}" for name in sorted(requires) if (path := self.loop(name, requires)))

    def loop(self, start: str, requires: Mapping[str, Sequence[str]]) -> list[str]:
        paths = [[start, required] for required in requires.get(start, ())]
        while paths:
            path = paths.pop()
            if path[-1] == start:
                return path
            paths += [[*path, required] for required in requires.get(path[-1], ()) if required not in path[1:]]
        return []

    def driver_suites(self, modules: Sequence[type[Module]], suites: SuiteList) -> tuple[str, ...]:
        owners = self.suite_modules(modules, suites)
        problems: list[str] = []
        for module in modules:
            reachable = {module.name, *module.dependencies}
            for driver in module.drivers:
                if driver.suite_name not in owners:
                    problems.append(f"driver {driver.name} names suite {driver.suite_name}, which no installed module ships")
                elif owners[driver.suite_name] not in reachable:
                    problems.append(f"driver {driver.name} names suite {driver.suite_name} of module {owners[driver.suite_name]}, which module {module.name} does not depend on")
        return tuple(problems)

    def wrong_suite_drivers(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        return tuple(f"driver {driver.name} belongs to suite {driver.suite_name}, so its name starts {driver.suite_name}."
                     for module in modules for driver in module.drivers if driver.name.partition(".")[0] != driver.suite_name)

    def preset_problems(self, modules: Sequence[type[Module]], suites: SuiteList) -> tuple[str, ...]:
        loaded_suites = {suite.name: suite for module in modules for suite in suites.module_suites(module)}
        problems: list[str] = []
        for suite in loaded_suites.values():
            offered = {window for name in (suite.name, *suite.requires) if name in loaded_suites for window in loaded_suites[name].offered_windows()}
            for page, presets in suite.offered_presets().items():
                keys = [preset.key for preset in presets]
                problems += [f"suite {suite.name} offers two presets keyed {key} for {page}" for key in dict.fromkeys(keys) if keys.count(key) > 1]
                problems += [f"suite {suite.name}'s preset {preset.key} for {page} shows {window}, which the suite does not offer"
                             for preset in presets for window in dict.fromkeys(layout_windows(preset.shape)) if window not in offered]
        return tuple(problems)
