import shutil
from pathlib import Path

from journal.support.caller import Caller
from journal.models.command_output import CommandOutput
from journal.repositories.command_outputs import CommandOutputs
from journal.repositories.setting_rows import SettingRows


class OutputLog:
    """The runner's outputs as numbered rows, a rolling log: each line it runs is a row, and past the kept number the oldest go with their folders."""

    def __init__(self, outputs: CommandOutputs, settings: SettingRows) -> None:
        self.outputs, self.settings = outputs, settings

    def start(self, chain: str, command: str, folder: Path, caller: Caller) -> CommandOutput:
        from journal.features.shell.feature import Shell
        actor = caller.actor
        output = self.outputs.save(CommandOutput(chain=chain, command=command, session=caller.session, folder=str(folder)), actor)
        for old in self.outputs.surplus(int(self.settings.option(Shell.OUTPUT_COUNT))):
            if Path(old.folder).is_dir():
                shutil.rmtree(old.folder)
            self.outputs.delete(old, actor)
        return output
