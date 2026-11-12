import hashlib
from dataclasses import dataclass

from engine.registry.setting_entry import SettingEntry
from engine.setting.setting_declaration import REFERENCE_TYPE
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from core.modules.settings.support.setting_reader import SettingReader


@dataclass(frozen=True)
class ScreenNode:
    """One setting of a screen as a viewer draws it: what it is, which component draws it, where it sits, what
    it holds now and where that came from, and the keys that must be on for it to show."""

    key: str
    kind: str
    component: str
    section: str
    parent: str | None
    title: str
    description: str
    value: object
    default: object
    source: str
    choices: tuple[str, ...]
    rule: str
    requires: tuple[str, ...]
    read_only: bool


@dataclass(frozen=True)
class ScreenReading:
    """Every node of a screen in the order it is drawn, and a revision that changes when any value or where it
    came from changes."""

    screen: str
    revision: str
    nodes: tuple[ScreenNode, ...]

    @staticmethod
    def revision_of(nodes: tuple[ScreenNode, ...]) -> str:
        return hashlib.sha256(repr([(node.key, node.value, node.source) for node in nodes]).encode()).hexdigest()[:12]


class SettingScreen:
    """Reads the settings that declare one screen as nodes, grouped by section in the order the sections are
    first declared and by declaration order inside a section. A screen is only a name a setting declares."""

    def __init__(self, declared: SettingCatalogue, reader: SettingReader) -> None:
        self.declared, self.reader = declared, reader

    def read(self, screen: str) -> ScreenReading:
        entries = tuple(entry for entry in self.declared.all() if entry.screen == screen and entry.type != REFERENCE_TYPE)
        sections = list(dict.fromkeys(entry.section for entry in entries))
        nodes = tuple(self.node(entry) for entry in sorted(entries, key=lambda entry: sections.index(entry.section)))
        return ScreenReading(screen, ScreenReading.revision_of(nodes), nodes)

    def node(self, entry: SettingEntry) -> ScreenNode:
        current = self.reader.current(entry.key)
        return ScreenNode(entry.key, entry.type, entry.drawn_by().value, entry.section, entry.parent, entry.title, entry.description, None if entry.secret else current.value,
                          None if entry.secret else entry.default, current.source, tuple(entry.choices), entry.rule, tuple(entry.required_settings), entry.person_set)
