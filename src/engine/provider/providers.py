from engine.container.container import Container
from engine.journal.journal_home import JournalHome
from engine.provider.provider import Provider
from engine.provider.errors.unknown_program_error import UnknownProgramError
from engine.registry.registry import Registry
from engine.errors.refusal import Refusal


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

    def effort(self, program: str, model: str) -> str:
        return self.provider(program).effort(model)

    def reported_model(self, program: str, home: JournalHome, session: str) -> str:
        return self.provider(program).reported_model(home, session)

    def executable(self, program: str) -> str:
        return self.provider(program).executable

    def context_tokens(self, program: str, home: JournalHome, session: str) -> int | None:
        return self.provider(program).context_tokens(home, session)

    def all(self) -> list[Provider]:
        return [self.provider(entry.name) for entry in self.registry.providers]

    def model_program(self, model: str) -> str:
        programs = [provider.name for provider in self.all() if model in provider.model_names()]
        if not programs:
            raise Refusal(f"no program offers model {model}", "name --program explicitly, or use --tier to choose by capability")
        if len(programs) > 1:
            raise Refusal(f"model {model} is offered by {', '.join(programs)}", "name --program explicitly")
        return programs[0]

    def skill_folders(self) -> tuple[str, ...]:
        return tuple(dict.fromkeys(provider.skills_folder for provider in self.all()))
