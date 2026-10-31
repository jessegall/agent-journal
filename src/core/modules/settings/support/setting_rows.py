from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.settings.models.secret_setting import SecretSetting
from core.modules.settings.models.setting import Setting

SettingModel = type[Setting] | type[SecretSetting]


class SettingRows:
    """Finds the one row of a key for an environment, or for the whole project with no environment, in the
    settings table or the secret settings table."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def row(self, model: SettingModel, key: str, environment_id: int | None) -> Setting | SecretSetting | None:
        query = self.queries.query(model).filter(key=key)
        rows = (query.matching(IsNull("environment_id")) if environment_id is None else query.filter(environment_id=environment_id)).page(1, 1).rows
        return rows[0] if rows else None
