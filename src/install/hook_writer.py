import sys
from pathlib import Path

from core.base.provider.program_hooks import ProgramHooks
from core.modules import DEFAULT_MODULES


class HookWriter:
    """Writes the hooks of every agent program the journal ships into a project, each calling the given hook
    runner; an upgrade touches only the programs whose hook file the project already has."""

    def __init__(self, root: Path) -> None:
        self.root = root
        self.programs = [ProgramHooks.hooks(provider, root) for module in DEFAULT_MODULES for provider in module.providers]

    def write(self, runner: str, is_upgrade: bool = False) -> None:
        for program in self.programs:
            if not is_upgrade or program.path.is_file():
                program.write(runner, self.root)


if __name__ == "__main__":
    HookWriter(Path(sys.argv[1])).write(sys.argv[2], sys.argv[3:] == ["1"])
