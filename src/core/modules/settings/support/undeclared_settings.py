import json
from collections.abc import Sequence
from dataclasses import dataclass

from core.base.query.queries import Queries
from core.base.registry.setting_entry import ANY_KEY, SettingEntry
from core.modules.settings.models.secret_setting import SecretSetting
from core.modules.settings.models.setting import Setting
from core.modules.settings.support.current_setting import CurrentSetting

JOURNAL_PREFIX = "journal."
MODULE_SEGMENTS = 3
UNCOVERED_REASON = "is declared by no installed module"
UNDECLARED_TYPE = "undeclared"


@dataclass(frozen=True)
class UndeclaredSetting:
    """A stored setting row no declaration covers, or one whose value is not of its declared type: its key, the
    module its key belongs to and why it is reported."""

    key: str
    module: str
    reason: str
    environment_id: int | None
    value: str
    is_secret: bool


class UndeclaredSettings:
    """Finds the stored setting rows the installed modules' declarations do not cover, by key and module; it
    only reads, and no row is ever deleted."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def found(self, entries: Sequence[SettingEntry]) -> list[UndeclaredSetting]:
        reports: list[UndeclaredSetting] = []
        for row in self.queries.query(Setting).oldest().all_rows():
            reports.extend(self.reports(entries, row.key, row.environment_id, row.value, False))
        for secret in self.queries.query(SecretSetting).oldest().all_rows():
            reports.extend(self.reports(entries, secret.key, secret.environment_id, "", True))
        return sorted(reports, key=lambda report: (report.key, report.environment_id or 0))

    def reports(self, entries: Sequence[SettingEntry], key: str, environment_id: int | None, value: str, is_secret: bool) -> list[UndeclaredSetting]:
        entry = self.covering(entries, key)
        if entry is None:
            return [UndeclaredSetting(key, self.module_name(key), UNCOVERED_REASON, environment_id, value, is_secret)]
        if not is_secret and not entry.accepts(json.loads(value)):
            return [UndeclaredSetting(key, entry.module, f"is not a {entry.type}", environment_id, value, is_secret)]
        return []

    @staticmethod
    def covering(entries: Sequence[SettingEntry], key: str) -> SettingEntry | None:
        for entry in entries:
            if entry.key == key:
                return entry
        for entry in entries:
            if entry.key.endswith(f".{ANY_KEY}") and key.startswith(entry.key.removesuffix(ANY_KEY)):
                return entry
        return None

    @staticmethod
    def module_name(key: str) -> str:
        segments = key.split(".")
        return ".".join(segments[:MODULE_SEGMENTS]) if key.startswith(JOURNAL_PREFIX) else segments[0]

    def current(self, entries: Sequence[SettingEntry], key: str, environment_id: int | None) -> CurrentSetting | None:
        reports = [report for report in self.found(entries) if report.key == key]
        matching = next((report for report in reports if report.environment_id == environment_id), None) or next((report for report in reports if report.environment_id is None), None)
        if matching is None:
            return None
        entry = SettingEntry(key, matching.module, None, key, f"the setting {matching.reason}", UNDECLARED_TYPE, None, matching.is_secret, "both", False, (), False, True)
        stored = "set" if matching.is_secret else json.loads(matching.value)
        return CurrentSetting(entry, stored, "environment" if matching.environment_id is not None else "project")
