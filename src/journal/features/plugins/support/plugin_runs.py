import fcntl
import subprocess
from pathlib import Path

from journal.features.plugins.support.plugin_folders import PluginFolders
from journal.features.plugins.support.plugin_runner import PluginRunner
from journal.models.plugin import Plugin
from journal.support.rejection import Rejection

RUNS = "runs"


class PluginRuns:
    """Runs a command for a plugin in a checkout with the plugin's environment, one run of a kind at a time, each line it prints passed on as it comes and its exit code kept."""

    def __init__(self, folders: PluginFolders, runner: PluginRunner) -> None:
        self.folders, self.runner = folders, runner

    def run(self, plugin: Plugin, environment: str, kind: str, checkout: str, command: list[str]) -> int:
        if not command:
            raise Rejection("no command to run: give it after --")
        if not Path(checkout).is_dir():
            raise Rejection(f"the checkout {checkout} is not a folder")
        with self.turn(plugin, kind):
            process = subprocess.Popen(command, cwd=checkout, env=self.runner.environment(plugin, environment), stdout=subprocess.PIPE, text=True, errors="replace")
            for line in process.stdout:
                print(line, end="", flush=True)
            return process.wait()

    def turn(self, plugin: Plugin, kind: str):
        folder = self.folders.data(plugin) / RUNS
        folder.mkdir(exist_ok=True)
        return RunTurn(folder / f"{kind}.lock")


class RunTurn:
    """The lock one run of a kind holds until it ends, so the next waits its turn."""

    def __init__(self, path: Path) -> None:
        self.path = path

    def __enter__(self) -> "RunTurn":
        self.file = self.path.open("w")
        fcntl.flock(self.file, fcntl.LOCK_EX)
        return self

    def __exit__(self, *ended) -> None:
        self.file.close()
