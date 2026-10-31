from collections.abc import Sequence
from dataclasses import dataclass
from pathlib import Path

from core.base.viewer.registry_lines import RegistryLines
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace


@dataclass(frozen=True)
class WindowDeclaration:
    """A window a module adds to the viewer: its name and title, the file the viewer loads from the module's
    web folder and how, where it belongs and for which agent roles, the window kit versions it was built for,
    the read lines and commands it may run, and the events it follows."""

    name: str
    title: str
    entry: str
    loading: WindowLoading
    place: WindowPlace = WindowPlace.ENVIRONMENT
    roles: Sequence[str] = ()
    kit: str = ">=1,<2"
    reads: Sequence[str] = ()
    runs: Sequence[str] = ()
    events: Sequence[str] = ()

    def problems(self, module_name: str, web_folder: Path, provided: RegistryLines) -> list[str]:
        short_name = module_name.rsplit(".", 1)[-1]
        problems = [f"the window {self.name} does not start with its module's name, {short_name}"] if not self.name.startswith(f"{short_name}.") else []
        if self.loading is not WindowLoading.DOCUMENT and not (web_folder / self.entry).exists():
            problems.append(f"{self.name} loads {self.entry}, which is not in its module's web/dist")
        problems += [f"{self.name} reads {line}, which is no read subcommand" for line in self.reads if line not in provided.reads]
        problems += [f"{self.name} runs {line}, which is no command" for line in self.runs if line not in provided.runs]
        problems += [f"{self.name} follows {pattern}, which no model's events match" for pattern in self.events if not provided.matches(pattern)]
        read_models = {line.split(" ", 1)[0].replace("-", "_") for line in self.reads}
        problems += [f"{self.name} follows {pattern} but reads no {pattern.split('.', 1)[0]}" for pattern in self.events
                     if provided.matches(pattern) and pattern.split(".", 1)[0] not in read_models]
        return problems
