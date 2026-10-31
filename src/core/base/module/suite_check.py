from collections.abc import Iterator, Mapping, Sequence

from core.base.driver.hook_event_name import HookEventName
from core.base.driver.suite import Suite
from core.base.module.module import Module
from core.base.module.name_groups import NameGroups
from core.base.registry.driver_rule_entry import ANY_HOOK, DriverRuleEntry
from core.base.viewer.layout_shape import layout_windows


class SuiteCheck:
    """Checks the suites, drivers and driver rules before a sync writes: names, requirements, suites reached
    through dependencies, defaults that fit their role and suite, presets that show only the suite's windows under keys of their own,
    and who owns each rule."""

    def problems(self, modules: Sequence[type[Module]], rules: Sequence[DriverRuleEntry]) -> tuple[str, ...]:
        return (self.duplicates(modules) + self.unknown_requirements(modules) + self.requirement_loops(modules) + self.driver_suites(modules)
                + self.wrong_suite_drivers(modules) + self.wrong_defaults(modules) + self.preset_problems(modules) + self.rule_owners(modules, rules)
                + self.unknown_hooks(rules))

    def suite_modules(self, modules: Sequence[type[Module]]) -> Mapping[str, str]:
        return {suite.name: module.name for module in modules for suite in module.suites}

    def duplicates(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        groups = (("suites", [suite.name for module in modules for suite in module.suites]), ("drivers", [driver.name for module in modules for driver in module.drivers]),
                  ("overlays", [overlay.name for module in modules for overlay in module.overlays]))
        return NameGroups.duplicates(groups)

    def unknown_requirements(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        shipped = self.suite_modules(modules)
        return tuple(f"suite {suite.name} requires suite {required}: install the module that ships it first"
                     for module in modules for suite in module.suites for required in suite.requires if required not in shipped)

    def requirement_loops(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        requires = {suite.name: tuple(suite.requires) for module in modules for suite in module.suites}
        return tuple(f"suite {name} requires itself through {' -> '.join(path)}" for name in sorted(requires) if (path := self.loop(name, requires)))

    def loop(self, start: str, requires: Mapping[str, Sequence[str]]) -> list[str]:
        paths = [[start, required] for required in requires.get(start, ())]
        while paths:
            path = paths.pop()
            if path[-1] == start:
                return path
            paths += [[*path, required] for required in requires.get(path[-1], ()) if required not in path[1:]]
        return []

    def driver_suites(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        owners = self.suite_modules(modules)
        problems: list[str] = []
        for module in modules:
            reachable = {module.name, *module.dependencies}
            for driver in module.drivers:
                if driver.suite.name not in owners:
                    problems.append(f"driver {driver.name} names suite {driver.suite.name}, which no installed module ships")
                elif owners[driver.suite.name] not in reachable:
                    problems.append(f"driver {driver.name} names suite {driver.suite.name} of module {owners[driver.suite.name]}, which module {module.name} does not depend on")
        return tuple(problems)

    def wrong_suite_drivers(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        return tuple(f"driver {driver.name} belongs to suite {driver.suite.name}, so its name starts {driver.suite.name}."
                     for module in modules for driver in module.drivers if driver.name.partition(".")[0] != driver.suite.name)

    def wrong_defaults(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        roles = {driver.name: driver.role for module in modules for driver in module.drivers}
        return tuple(problem for module in modules for suite in module.suites for role, driver in suite.defaults.items()
                     for problem in self.default_problems(suite, role, driver, roles))

    def default_problems(self, suite: type[Suite], role: str, driver: str, roles: Mapping[str, str]) -> Iterator[str]:
        if driver.partition(".")[0] not in (suite.name, *suite.requires):
            yield f"suite {suite.name} gives role {role} driver {driver}, of a suite it does not require"
        elif driver in roles and roles[driver] != role:
            yield f"suite {suite.name} gives role {role} driver {driver}, which drives role {roles[driver]}"

    def preset_problems(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        suites = {suite.name: suite for module in modules for suite in module.suites}
        problems: list[str] = []
        for suite in suites.values():
            offered = {window for name in (suite.name, *suite.requires) if name in suites for window in suites[name].windows}
            for page, presets in suite.presets.items():
                keys = [preset.key for preset in presets]
                problems += [f"suite {suite.name} offers two presets keyed {key} for {page}" for key in dict.fromkeys(keys) if keys.count(key) > 1]
                problems += [f"suite {suite.name}'s preset {preset.key} for {page} shows {window}, which the suite does not offer"
                             for preset in presets for window in dict.fromkeys(layout_windows(preset.shape)) if window not in offered]
        return tuple(problems)

    def rule_owners(self, modules: Sequence[type[Module]], rules: Sequence[DriverRuleEntry]) -> tuple[str, ...]:
        module_names = {module.name for module in modules}
        problems = [f"rule {rule.name} is listed by {rule.owner} and also names driver patterns" for rule in rules if rule.owner not in module_names and (rule.drivers or rule.roles)]
        problems += [f"rule {rule.name} names no driver pattern, so no driver hears it" for rule in rules if rule.owner in module_names and not rule.drivers]
        return tuple(problems)

    def unknown_hooks(self, rules: Sequence[DriverRuleEntry]) -> tuple[str, ...]:
        names = {*HookEventName, ANY_HOOK}
        return tuple(f"rule {rule.name} covers hook {rule.hook}, which no agent program sends" for rule in rules if rule.hook not in names)
