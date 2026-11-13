import hashlib

from engine.registry.setting_entry import SettingEntry
from engine.setting.setting_declaration import REFERENCE_TYPE
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.settings.support.screen_node import ScreenNode
from core.modules.settings.support.screen_reading import ScreenReading
from core.modules.settings.support.screen_index_entry import ScreenIndexEntry


HELPER_TYPE_SCREEN = "helper-type"
HELPERS_TAB = "Helpers"


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

    def index(self) -> tuple[ScreenIndexEntry, ...]:
        return tuple(ScreenIndexEntry(entry.key, entry.title, entry.description, self.path(entry), entry.screen, entry.section)
                     for entry in self.declared.all() if entry.screen and entry.type != REFERENCE_TYPE)

    @staticmethod
    def path(entry: SettingEntry) -> str:
        tab, _, category = entry.screen.partition(".")
        if tab == HELPER_TYPE_SCREEN:
            return f"{HELPERS_TAB} > {category.replace('-', ' ').capitalize()}" if category else f"{HELPERS_TAB} > {entry.section}"
        return f"{tab.capitalize()} > {entry.section}"
