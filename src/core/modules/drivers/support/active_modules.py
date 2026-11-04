from core.base.registry.registry import Registry
from core.modules.drivers.support.suite_choice import SuiteChoice


class ActiveModules:
    """Decides which modules apply in an environment, using its suite and the suites it requires."""

    def __init__(self, registry: Registry, choice: SuiteChoice) -> None:
        self.registry, self.choice = registry, choice

    def is_active(self, module_name: str, environment_id: int | None) -> bool:
        suites = self.registry.module_suites.get(module_name, ())
        return environment_id is None or not suites or any(self.choice.runs(environment_id, name) for name in suites)

    def inactive(self, environment_id: int | None) -> tuple[str, ...]:
        return tuple(name for name in self.registry.module_suites if not self.is_active(name, environment_id))
