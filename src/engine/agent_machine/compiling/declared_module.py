from dataclasses import dataclass

from engine.agent_machine.compiling.contribution_declaration import ContributionDeclaration


@dataclass(frozen=True)
class DeclaredModule:
    """A module as sync compiles it: its name, whether it is a core module, the modules it depends on, its contributions
    and the names of any state classes it defines, which sync refuses."""

    name: str
    is_core: bool
    dependencies: tuple[str, ...]
    contributions: tuple[ContributionDeclaration, ...]
    state_classes: tuple[str, ...] = ()
