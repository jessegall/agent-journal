from core.base.container import Container
from core.base.journal_home import JournalHome
from core.base.provider.provider import Provider
from core.base.provider.unknown_program_error import UnknownProgramError
from core.base.registry.registry import Registry


class Providers:
    """The registered providers by the program name a hook or an agent row gives."""

    def __init__(self, registry: Registry, container: Container) -> None:
        self.registry, self.container = registry, container

    def provider(self, program: str) -> Provider:
        entry = next((entry for entry in self.registry.providers if entry.name == program), None)
        if entry is None:
            raise UnknownProgramError(f"no module provides the agent program {program!r}")
        return self.container.get(entry.path.checked_class(Provider))

    def session_effort(self, program: str, home: JournalHome, session: str) -> str:
        return self.provider(program).session_effort(home, session)

    def reported_model(self, program: str, home: JournalHome, session: str) -> str:
        return self.provider(program).reported_model(home, session)

    def context_percent(self, program: str, home: JournalHome, session: str) -> int | None:
        return self.provider(program).context_percent(home, session)

    def all(self) -> list[Provider]:
        return [self.provider(entry.name) for entry in self.registry.providers]

    def skill_folders(self) -> tuple[str, ...]:
        return tuple(dict.fromkeys(provider.skills_folder for provider in self.all()))
