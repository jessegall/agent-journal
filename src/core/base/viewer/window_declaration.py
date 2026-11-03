from collections.abc import Sequence
from dataclasses import dataclass
from pathlib import Path

from core.base.declaration_names import DeclarationNames
from core.base.viewer.auto_scroll import AutoScroll
from core.base.viewer.choice_option import ChoiceOption
from core.base.viewer.registry_lines import RegistryLines
from core.base.viewer.toggle_option import ToggleOption
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_size import WindowSize
from core.base.viewer.window_search import WindowSearch
from core.base.viewer.window_tab import WindowTab
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.base.viewer.window_shows import WindowShows

DEFAULT_FLOAT_SIZE = WindowSize(400, 340)


@dataclass(frozen=True)
class WindowDeclaration:
    """A window a module adds to the viewer: its name and title, the file the viewer loads from the module's
    web folder and how, where it is drawn, whose work it shows and for which agent roles, the window kit
    versions it was built for, the read lines and commands it may run, the events it follows, its icon, the
    size it floats at, the options of its pane menu, the end it follows as rows arrive, the tabs inside it,
    the read line its tab counts with and the read lines a share link may use, each written as the line and,
    after a space, the argument that names an id of the shared row or of a row it includes, and the search its
    bar offers."""

    name: str
    title: str
    entry: str
    loading: WindowLoading
    place: WindowPlace = WindowPlace.PANE
    shows: WindowShows = WindowShows.ENVIRONMENT
    roles: Sequence[str] = ()
    kit: str = ">=1,<2"
    reads: Sequence[str] = ()
    runs: Sequence[str] = ()
    events: Sequence[str] = ()
    icon: WindowIcon = WindowIcon.WINDOW
    float_size: WindowSize = DEFAULT_FLOAT_SIZE
    options: Sequence[ToggleOption | ChoiceOption] = ()
    count: str = ""
    shared_reads: Sequence[str] = ()
    group: str = ""
    auto_scroll: AutoScroll = AutoScroll.NONE
    tabs: Sequence[WindowTab] = ()
    search: WindowSearch | None = None

    def problems(self, module_name: str, web_folder: Path, provided: RegistryLines) -> list[str]:
        problems = DeclarationNames.prefix_problems(f"the window {self.name}", self.name, module_name)
        if self.loading is not WindowLoading.DOCUMENT and not (web_folder / self.entry).exists():
            problems.append(f"{self.name} loads {self.entry}, which is not in its module's web/dist")
        problems += [f"{self.name} reads {line}, which is no read subcommand" for line in self.reads if line not in provided.reads]
        problems += [f"{self.name} runs {line}, which is no command" for line in self.runs if line not in provided.runs]
        problems += [f"{self.name} follows {pattern}, which no model's events match" for pattern in self.events if not provided.matches(pattern)]
        keys = [option.key for option in self.options]
        problems += [f"{self.name} names the option {key} twice" for key in dict.fromkeys(keys) if keys.count(key) > 1]
        if self.shows is WindowShows.SELECTED_AGENT and self.place is not WindowPlace.PANE:
            problems.append(f"{self.name} shows one agent's work but is drawn in a {self.place.value}, and only a pane has an agent to pick")
        problems += DeclarationNames.icon_problems(f"the window {self.name}", self.icon)
        problems += [f"{self.name} starts its option {option.key} at {option.default}, which is none of its choices" for option in self.options
                     if isinstance(option, ChoiceOption) and option.default not in (value for value, _ in option.choices)]
        if self.float_size.width <= 0 or self.float_size.height <= 0:
            problems.append(f"{self.name} floats at {self.float_size.width} by {self.float_size.height}, and a size is above 0")
        if self.count and self.count not in self.reads:
            problems.append(f"{self.name} counts with {self.count}, which is not one of its reads")
        problems += [f"{self.name} fills its tab {tab.key} with {tab.read}, which is not one of its reads" for tab in self.tabs if not any(tab.read.startswith(line) for line in self.reads)]
        shared_lines = [line.rsplit(" ", 1)[0] for line in self.shared_reads]
        problems += [f"{self.name} shares {line}, which is not one of its reads" for line in shared_lines if line not in self.reads]
        read_models = {line.split(" ", 1)[0].replace("-", "_") for line in self.reads}
        problems += [f"{self.name} follows {pattern} but reads no {pattern.split('.', 1)[0]}" for pattern in self.events
                     if provided.matches(pattern) and not self.reads_model(pattern.split(".", 1)[0], read_models)]
        if self.search is not None:
            problems += self.search.problems(self.name)
        return problems

    @staticmethod
    def reads_model(model: str, read_models: set[str]) -> bool:
        return any(model == read or model.startswith(f"{read}_") for read in read_models)
