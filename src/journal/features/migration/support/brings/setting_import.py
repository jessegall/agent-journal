import json
from pathlib import Path

from journal.features.migration.support.import_tally import ImportTally
from journal.features.registry import Registry
from journal.support.actor import Actor
from journal.models.setting import Setting
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.setting_rows import SettingRows


class SettingImport:
    """The features the project switched on or off in version 3, where version 4 has a feature of the same name; the rest of version 3's settings have no home here."""

    def __init__(self, settings: SettingRows, registry: Registry, tally: MigratedRows) -> None:
        self.settings, self.registry, self.ledger = settings, registry, tally

    def import_rows(self, folder: Path, actor: Actor) -> ImportTally:
        path = folder / "settings.json"
        if not path.is_file():
            return ImportTally("settings")
        features = json.loads(path.read_text()).get("features", {})
        stored = {name: enabled for name, enabled in features.items() if self.registry.has_feature(name) and not self.ledger.is_imported(f"settings/features.{name}")}
        for name, enabled in stored.items():
            self.ledger.record(f"settings/features.{name}", self.settings.save(Setting(environment_id=0, key=f"features.{name}", value=bool(enabled)), actor), actor)
        return ImportTally("settings", len(stored), tuple(f"feature {name}: version 4 has no feature of that name" for name in features if not self.registry.has_feature(name)))
