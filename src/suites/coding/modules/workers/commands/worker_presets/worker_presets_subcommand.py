from argparse import ArgumentParser, Namespace
from pathlib import Path

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.subcommand.row_list import RowList
from core.modules.environments.support.environment_rows import EnvironmentRows
from suites.coding.modules.workers.support.project_manifests import ProjectManifests
from suites.coding.modules.workers.support.worker_test_presets import WorkerTestPresets


class WorkerPresetsSubcommand(ReadSubcommand[RowList]):
    """`journal worker presets`: the package manifests found in the environment's folder, the language each names,
    and the test commands each dispatched worker gets with no grant, a user's presets included."""

    cli_name = "worker"
    name = "presets"

    def __init__(self, environments: EnvironmentRows, manifests: ProjectManifests, presets: WorkerTestPresets) -> None:
        self.environments, self.manifests, self.presets = environments, manifests, presets

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        if caller.environment_id is None:
            raise Refusal("the presets belong to an environment's folder", "run this from an environment")
        folder = self.environments.find(caller.environment_id).folder
        matched = self.manifests.found(Path(folder))
        manifests = [{"id": manifest.path, "kind": "manifest", "language": manifest.language} for manifest in matched]
        commands = [{"id": entry.name, "kind": "test command", "command": entry.command} for entry in self.presets.presets_of(matched)]
        return RowList([*manifests, *commands])

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, RowList):
            return
        lines = [f"manifest {row['id']}: {row['language']}" if row["kind"] == "manifest" else f"test command {row['id']}={row['command']}" for row in value.rows]
        output.write("\n".join(lines) or "no manifest found and no test command preset", value.json())
