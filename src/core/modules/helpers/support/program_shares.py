from collections.abc import Mapping, Sequence

from core.base.provider.providers import Providers
from core.base.scope.scopes import Scopes
from engine.time.timestamp import Timestamp
from core.modules.helpers.support.helper_settings import PROGRAM_SPLIT
from core.modules.helpers.support.program_share import ProgramShare
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.settings.models.setting import Setting
from core.modules.settings.support.setting_rows import SettingRows


class ProgramShares:
    """Chooses the ready program furthest below its share of recent work."""

    def __init__(self, settings: SettingValues, providers: Providers, rows: SettingRows, scopes: Scopes) -> None:
        self.settings, self.providers, self.rows, self.scopes = settings, providers, rows, scopes

    @property
    def is_configured(self) -> bool:
        return bool(self.settings.texts(PROGRAM_SPLIT))

    def shares(self) -> dict[str, int]:
        program_names = {provider.name for provider in self.providers.all()}
        entries = [ProgramShare.parsed(line) for line in self.settings.texts(PROGRAM_SPLIT)]
        return {entry.program: entry.percent for entry in entries if entry.program in program_names}

    def changed_at(self) -> Timestamp | None:
        row = self.rows.row(Setting, PROGRAM_SPLIT, self.scopes.environment_id)
        if row is None and self.scopes.environment_id is not None:
            row = self.rows.row(Setting, PROGRAM_SPLIT, None)
        return row.update_timestamp() if row is not None else None

    def next_program(self, counts: Mapping[str, int], ready: Sequence[str]) -> str | None:
        shares = {name: share for name, share in self.shares().items() if name in ready and share > 0}
        if not shares:
            return None
        total_work, total_share = sum(counts.values()) + 1, sum(shares.values())
        return max(shares, key=lambda name: shares[name] / total_share - counts.get(name, 0) / total_work)
