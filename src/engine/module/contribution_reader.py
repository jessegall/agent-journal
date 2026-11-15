from typing import get_type_hints

from engine.agent_machine.compiling.contribution_declaration import ContributionDeclaration
from engine.agent_machine.compiling.module_contributions import ModuleContributions
from engine.enums.contribution_type import ContributionType
from engine.module.module import Module

CORE_PACKAGE = "core."


class ContributionReader:
    """Reads a module's lists for the agent machine into declarations sync can check and compile: each class's
    key, rank, agent types and what its list asks it to declare, and the names of the types its constructor
    takes, so sync can refuse a source that takes a bus or file access."""

    def read(self, module: type[Module]) -> ModuleContributions:
        contributions = [
            *(self.declared(cls, ContributionType.NEED, rank=cls.rank, agent_types=tuple(cls.agent_types), state_name=cls.state_type.__name__) for cls in module.states),
            *(self.declared(cls, ContributionType.FACT, agent_types=tuple(cls.agent_types)) for cls in module.facts),
            *(self.declared(cls, ContributionType.POLICY, key=cls.key, rank=cls.rank, agent_types=tuple(cls.agent_types), is_safety=cls.is_safety)
              for cls in module.policies),
            *(self.declared(cls, ContributionType.LINE, events=tuple(cls.events), channel=cls.channel) for cls in module.lines),
            *(self.declared(cls, ContributionType.TRANSFORM, slot=cls.slot) for cls in module.transforms),
            *(self.declared(cls, ContributionType.EFFECT, events=tuple(cls.events), is_required=cls.is_required, has_failure=cls.failure is not None)
              for cls in module.effects),
            *(self.declared(cls, ContributionType.WAKE_CAUSE, key=cls.key) for cls in module.wake_causes),
            *(ContributionDeclaration(model.model_name, ContributionType.SUBJECT) for model in module.subjects),
            *(self.declared(cls, ContributionType.AGENT_LISTENER) for cls in module.agent_listeners),
        ]
        return ModuleContributions(module.name, module.__module__.startswith(CORE_PACKAGE), tuple(module.dependencies), tuple(contributions))

    @staticmethod
    def declared(cls: type, contribution_type: ContributionType, key: str = "", **fields: object) -> ContributionDeclaration:
        return ContributionDeclaration(key or f"{cls.__module__}.{cls.__qualname__}", contribution_type,
                                       constructor_types=ContributionReader.constructor_types(cls), **fields)

    @staticmethod
    def constructor_types(cls: type) -> tuple[str, ...]:
        hints = get_type_hints(cls.__init__) if "__init__" in vars(cls) else {}
        return tuple(hint.__name__ for name, hint in hints.items() if name != "return" and isinstance(hint, type))
