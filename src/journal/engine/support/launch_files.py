import json

from journal.config import Config
from journal.providers.providers import Providers
from journal.repositories.environments import Environments


class LaunchFiles:
    """What the launch of each environment's agent was: the file the launcher writes under runtime/launches, read for the flags the agent runs with."""

    def __init__(self, config: Config, environments: Environments, providers: Providers) -> None:
        self.config, self.environments, self.providers = config, environments, providers

    def skips_prompts(self, environment_id: int) -> bool:
        """Whether the agent of the environment was started with its permission prompts skipped, so a permission question it asks anyway is the journal's to answer with yes."""
        path = self.config.home / "runtime" / "launches" / f"{self.environments.find(environment_id).name}.json"
        if not path.is_file():
            return False
        command = json.loads(path.read_text()).get("front", {}).get("command", [])
        return any(flag in command for provider in self.providers.all() for flag in provider.skip_prompts)
