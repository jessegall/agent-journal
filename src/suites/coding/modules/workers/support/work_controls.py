import hashlib

from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.registry.setting_entry import SettingEntry
from engine.enums.setting_type import SettingType
from core.modules.settings.support.setting_changes import SettingChanges
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from core.modules.settings.support.setting_reader import SettingReader
from suites.coding.modules.workers.support.coding_main_options import CONTROL_KEYS, CodingMainOptions
from suites.coding.support.main_options import PRESET_LINES, PRESETS
from suites.coding.modules.workers.support.work_catalogue import EDITABLE_KEYS, GROUPS, FIELD_BADGES, FIELD_CHOICES
from suites.coding.support.work_field import WorkField
from suites.coding.support.work_settings import WorkPreset, WorkSettings


class WorkControls:
    """Reads the seven workflow controls and changes them together: every change is checked before
    any is written, and a change made from a reading that has since changed is refused, so a user
    never overwrites what they did not see."""

    def __init__(self, options: CodingMainOptions, declared: SettingCatalogue, changes: SettingChanges, reader: SettingReader) -> None:
        self.options, self.declared, self.changes, self.reader = options, declared, changes, reader

    def shown(self) -> WorkSettings:
        current = self.options.options()
        controls = tuple(zip(CONTROL_KEYS.values(), current.bundle, strict=True))
        fields = tuple(self.field(group, key) for group, keys in GROUPS.items() for key in keys)
        revision = hashlib.sha256(repr((controls, current.sources, current.problems, [(field.key, field.value, field.source) for field in fields])).encode()).hexdigest()[:12]
        depends = {key: tuple(self.declared.value(key).required_settings) for key in (*CONTROL_KEYS.values(), *(row.key for row in fields))}
        presets = tuple(WorkPreset(name, name.capitalize(), PRESET_LINES[name], tuple(zip(CONTROL_KEYS.values(), bundle, strict=True))) for name, bundle in PRESETS.items())
        switches = tuple((key, self.declared.value(key).title) for key in CONTROL_KEYS.values())
        return WorkSettings(current.workflow, revision, controls, fields, {key: keys for key, keys in depends.items() if keys}, presets, switches)

    def field(self, group: str, key: str) -> WorkField:
        current = self.reader.current(key)
        choices = tuple(current.entry.choices) if current.entry.type == SettingType.CHOICE.value else FIELD_CHOICES.get(key, ())
        return WorkField(key, group, current.entry.title, current.entry.description, current.entry.type, current.value, current.source, choices, FIELD_BADGES.get(key, ""))

    def preset(self, name: str, revision: str, context: Context) -> WorkSettings:
        if name not in PRESETS:
            raise Refusal(f"{name} is not a preset", f"choose one of {', '.join(PRESETS)}")
        return self.apply(revision, tuple((key, "on" if value else "off") for key, value in zip(CONTROL_KEYS.values(), PRESETS[name], strict=True)), context)

    def apply(self, revision: str, changes: tuple[tuple[str, str], ...], context: Context) -> WorkSettings:
        if revision != self.shown().revision:
            raise Refusal("the work settings changed since you read them", "run journal work-settings show and apply again")
        self.changes.apply([(self.work_control(key), text) for key, text in changes], context)
        return self.shown()

    def work_control(self, key: str) -> SettingEntry:
        if key not in (*CONTROL_KEYS.values(), *EDITABLE_KEYS):
            raise Refusal(f"{key} is not a work control", f"the work controls are {', '.join((*CONTROL_KEYS.values(), *EDITABLE_KEYS))}")
        return self.declared.value(key)
