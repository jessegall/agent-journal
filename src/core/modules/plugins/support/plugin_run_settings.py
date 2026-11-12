from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class PluginRunSettings:
    """The environment a plugin's command runs for and the file holding the plugin's settings for it."""

    environment: str
    settings_file: Path

    def variables(self) -> dict[str, str]:
        return {"JOURNAL_ENV": self.environment, "JOURNAL_SETTINGS": str(self.settings_file)}
