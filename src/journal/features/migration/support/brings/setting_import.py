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

    def __init__(self, settings: SettingRows, registry: Registry, ledger: MigratedRows) -> None:
        self.settings, self.registry, self.ledger = settings, registry, ledger

    def bring(self, folder: Path, actor: Actor) -> ImportTally:
        path = folder / "settings.json"
        if not path.is_file():
            return ImportTally("settings")
        features = json.loads(path.read_text()).get("features", {})
        kept = {name: on for name, on in features.items() if self.registry.has_feature(name) and not self.ledger.is_brought(f"settings/features.{name}")}
        for name, on in kept.items():
            self.ledger.record(f"settings/features.{name}", self.settings.save(Setting(environment_id=0, key=f"features.{name}", value=bool(on)), actor), actor)
        return ImportTally("settings", len(kept), tuple(f"feature {name}: version 4 has no feature of that name" for name in features if not self.registry.has_feature(name)))
