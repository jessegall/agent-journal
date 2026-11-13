import re
from collections.abc import Iterable, Sequence
from pathlib import Path

from engine.enums.setting_type import SettingType
from engine.file.file_access import FileAccess
from engine.module.module import Module
from engine.registry.setting_entry import SettingEntry
from engine.registry.setting_tree import SettingTree

VIEW_SUFFIXES = (".vue", ".js", ".ts")
SKIPPED_PARTS = frozenset({"node_modules", "dist"})
SETTING_COMPONENTS_FOLDER = "src/core/modules/setting_components/"
VIEWER_FOLDER = "src/viewer/src/"
SETTING_KEY = re.compile(r"journal(?:\.[a-z0-9_-]+)+")


class SettingViewCheck:
    """Lists the view files that name a declared setting key as text, which is how a screen comes to draw one
    setting by hand: a screen is drawn from what the settings declare, so no key is written in its code. A
    file that reads a key for something other than drawing a row is named in allowed, each with its reason."""

    def __init__(self, project_folder: Path, modules: Sequence[type[Module]], allowed: dict[str, str]) -> None:
        self.project_folder, self.modules, self.allowed = project_folder, modules, allowed

    def declared_keys(self) -> frozenset[str]:
        return frozenset(entry.key for module in self.modules for entry in SettingTree().entries(module.name, module.settings))

    def view_files(self) -> Iterable[Path]:
        for path in sorted((self.project_folder / "src").rglob("*")):
            relative = path.relative_to(self.project_folder).as_posix()
            if path.suffix in VIEW_SUFFIXES and ("/web/src/" in relative or relative.startswith(VIEWER_FOLDER)) and not SKIPPED_PARTS.intersection(path.parts) and not relative.startswith(SETTING_COMPONENTS_FOLDER):
                yield path

    def named_keys(self, text: str, keys: frozenset[str]) -> list[str]:
        return sorted({matched for matched in SETTING_KEY.findall(text) if matched in keys})

    def failures(self) -> list[str]:
        keys = self.declared_keys()
        problems = []
        for path in self.view_files():
            relative = path.relative_to(self.project_folder).as_posix()
            matching = self.named_keys(FileAccess.shared().read(path), keys)
            if matching and relative not in self.allowed:
                problems.append(f"{relative} names the declared settings {', '.join(matching)}: draw them from their declaration")
        return problems

    def unknown_allowances(self) -> list[str]:
        return [path for path in self.allowed if not (self.project_folder / path).is_file()]

    def component_failures(self) -> list[str]:
        entries: list[SettingEntry] = [entry for module in self.modules for entry in SettingTree().entries(module.name, module.settings) if entry.type in {category.value for category in SettingType}]
        return [f"{entry.key} is a {entry.type}, which the component {entry.drawn_by().value} cannot draw" for entry in entries if entry.type not in {category.value for category in entry.drawn_by().kinds()}]
