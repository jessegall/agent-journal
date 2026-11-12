from engine.database.database import Database
from engine.database.kept_rows import KeptRows
from engine.database.shared_tables import SharedTables
from engine.query.queries import Queries
from core.modules.settings.models.secret_setting import SecretSetting
from core.modules.settings.models.setting import Setting

SettingModel = type[Setting] | type[SecretSetting]
TABLES: dict[SettingModel, str] = {Setting: "settings", SecretSetting: "secret_settings"}
KEPT_SETTINGS_REASON = "every stored setting is read once and kept until a setting is written"


class SettingRows:
    """Finds the one row of a key for an environment, or for the whole project with no environment,
    in the settings table or the secret settings table, and the keys either table stores; a
    table is read once, across containers, and again only when it changes."""

    def __init__(self, queries: Queries, kept: KeptRows, shared: SharedTables, database: Database) -> None:
        self.queries, self.kept, self.shared, self.database = queries, kept, shared, database

    def row(self, model: SettingModel, key: str, environment_id: int | None) -> Setting | SecretSetting | None:
        return self.kept_table(model).get((key, environment_id))

    def kept_table(self, model: SettingModel) -> dict[tuple[str, int | None], Setting | SecretSetting]:
        return self.kept.read_matching_signature(self.queries.query(model), lambda signature: self.shared.read(self.database, TABLES[model], signature, lambda: self.table(model)), name="settings.rows")

    def table(self, model: SettingModel) -> dict[tuple[str, int | None], Setting | SecretSetting]:
        return {(row.key, row.environment_id): row for row in self.queries.query(model).full_table(KEPT_SETTINGS_REASON).all_rows()}

    def remember(self, row: Setting | SecretSetting) -> None:
        def with_row(rows: dict[tuple[str, int | None], Setting | SecretSetting]) -> dict[tuple[str, int | None], Setting | SecretSetting]:
            return {**rows, (row.key, row.environment_id): row}

        self.kept.update(self.queries.query(type(row)), with_row, name="settings.rows")

    def remove(self, row: Setting | SecretSetting) -> None:
        def without_row(rows: dict[tuple[str, int | None], Setting | SecretSetting]) -> dict[tuple[str, int | None], Setting | SecretSetting]:
            return {key: value for key, value in rows.items() if key != (row.key, row.environment_id)}

        self.kept.update(self.queries.query(type(row)), without_row, name="settings.rows")

    def stored_keys(self) -> list[str]:
        return list(dict.fromkeys(key for model in (Setting, SecretSetting) for key, _ in self.kept_table(model)))
