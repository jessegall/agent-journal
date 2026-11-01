from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.modules.settings.models.secret_setting import SecretSetting
from core.modules.settings.models.setting import Setting

SettingModel = type[Setting] | type[SecretSetting]
TABLES: dict[SettingModel, str] = {Setting: "settings", SecretSetting: "secret_settings"}


class SettingRows:
    """Finds the one row of a key for an environment, or for the whole project with no environment, in the
    settings table or the secret settings table, and the keys either table stores; a table is read once and again only
    when it changes."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def row(self, model: SettingModel, key: str, environment_id: int | None) -> Setting | SecretSetting | None:
        return self.kept.of(TABLES[model], lambda: self.table(model)).get((key, environment_id))

    def table(self, model: SettingModel) -> dict[tuple[str, int | None], Setting | SecretSetting]:
        return {(row.key, row.environment_id): row for row in self.queries.query(model).all_rows()}

    def stored_keys(self) -> list[str]:
        return list(dict.fromkeys(row.key for model in (Setting, SecretSetting) for row in self.queries.query(model).oldest().all_rows()))
