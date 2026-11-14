from engine.registry.registry import Registry
from engine.scope.scopes import Scopes
from core.modules.drivers.support.suite_choice import SuiteChoice


class ActiveModules:
    """Decides which modules apply in an environment, using its suite and the suites it requires."""

    def __init__(self, registry: Registry, choice: SuiteChoice, scopes: Scopes) -> None:
        self.registry, self.choice, self.scopes = registry, choice, scopes

    def is_active(self, module_name: str) -> bool:
        suites = self.registry.module_suites.get(module_name, ())
        return self.scopes.environment_id is None or not suites or any(self.choice.runs(name) for name in suites)

    def inactive(self) -> tuple[str, ...]:
        return tuple(name for name in self.registry.module_suites if not self.is_active(name))
