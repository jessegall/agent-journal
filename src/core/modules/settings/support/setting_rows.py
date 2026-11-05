from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.modules.settings.models.secret_setting import SecretSetting
from core.modules.settings.models.setting import Setting

SettingModel = type[Setting] | type[SecretSetting]
TABLES: dict[SettingModel, str] = {Setting: "settings", SecretSetting: "secret_settings"}


class SettingRows:
    """Finds the one row of a key for an environment, or for the whole project with no environment,
    in the settings table or the secret settings table, and the keys either table stores; a
    table is read once and again only when it changes."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def row(self, model: SettingModel, key: str, environment_id: int | None) -> Setting | SecretSetting | None:
        return self.kept_table(model).get((key, environment_id))

    def kept_table(self, model: SettingModel) -> dict[tuple[str, int | None], Setting | SecretSetting]:
        return self.kept.read(TABLES[model], lambda: self.table(model), name="settings.rows")

    def table(self, model: SettingModel) -> dict[tuple[str, int | None], Setting | SecretSetting]:
        return {(row.key, row.environment_id): row for row in self.queries.query(model).all_rows()}

    def remember(self, row: Setting | SecretSetting) -> None:
        self.kept.update(TABLES[type(row)], lambda rows: {**rows, (row.key, row.environment_id): row}, name="settings.rows")

    def remove(self, row: Setting | SecretSetting) -> None:
        self.kept.update(TABLES[type(row)], lambda rows: {key: value for key, value in rows.items() if key != (row.key, row.environment_id)}, name="settings.rows")

    def stored_keys(self) -> list[str]:
        return list(dict.fromkeys(key for model in (Setting, SecretSetting) for key, _ in self.kept_table(model)))
