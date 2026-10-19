import shutil
from pathlib import Path

from journal.models.actor import Actor
from journal.models.command_output import CommandOutput
from journal.repositories.command_outputs import CommandOutputs
from journal.repositories.settings import Settings


class OutputLog:
    """The runner's outputs as numbered rows, a rolling log: each line it runs is a row, and past the kept number the oldest go with their folders."""

    def __init__(self, outputs: CommandOutputs, settings: Settings) -> None:
        self.outputs, self.settings = outputs, settings

    def began(self, chain: str, command: str, folder: Path, session: str, by: Actor) -> CommandOutput:
        from journal.features.shell.feature import Shell
        output = self.outputs.save(CommandOutput(chain=chain, command=command, session=session, folder=str(folder)), by)
        for old in self.outputs.beyond(int(self.settings.option(Shell.KEPT))):
            if Path(old.folder).is_dir():
                shutil.rmtree(old.folder)
            self.outputs.delete(old, by)
        return output
