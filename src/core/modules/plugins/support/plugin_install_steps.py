import json
import subprocess
from engine.enums.process_type import ProcessType
from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from pathlib import Path

from engine.errors.refusal import Refusal
from engine.types.type_guards import is_mapping
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_program import PluginProgram

STEP_LIMIT_SECONDS = 600


class PluginInstallSteps:
    """The steps a plugin's manifest asks of its install, as version 4 ran them: each program it requires
    found, its setup steps run in order in its folder, and its installed command's answer read as its
    settings."""

    def __init__(self, program: PluginProgram, executor: ProcessExecutor) -> None:
        self.program, self.executor = program, executor

    def check_requirements(self, manifest: PluginManifest, folder: Path) -> None:
        for requirement in manifest.requirements:
            if self.shell(requirement.check, manifest.name, folder).returncode != 0:
                raise Refusal(f"{requirement.name} is missing: {requirement.hint}", "install it, then install the plugin again")

    def run_setup(self, manifest: PluginManifest, folder: Path) -> None:
        self.program.write_settings(manifest.name, {setting.key: setting.default for setting in manifest.settings})
        for step in manifest.setup_steps:
            run = self.shell(step.line, manifest.name, folder)
            if run.returncode != 0:
                output_lines = [line for line in (run.stderr + run.stdout).splitlines() if line.strip()]
                last_line = output_lines[-1] if output_lines else f"it ended with {run.returncode}"
                raise Refusal(f"the setup step {step.name} failed: {last_line}", "fix what it needs and install the plugin again")

    def installed_settings(self, manifest: PluginManifest, folder: Path) -> dict[str, object]:
        if not manifest.installed_command:
            return {}
        run = self.shell(manifest.installed_command, manifest.name, folder)
        lines = [line for line in run.stdout.splitlines() if line.strip()]
        answer: object = json.loads(lines[-1]) if run.returncode == 0 and lines else None
        return {str(key): value for key, value in answer.items()} if is_mapping(answer) else {}

    def shell(self, line: str, plugin_name: str, folder: Path) -> "subprocess.CompletedProcess[str]":
        try:
            finished = self.executor.execute(ExecutionRequest(["sh", "-c", line], folder, ProcessType.PLUGIN, STEP_LIMIT_SECONDS, variables=self.program.environment(plugin_name, "")))
        except RunTimeLimitError as error:
            raise subprocess.TimeoutExpired(line, STEP_LIMIT_SECONDS) from error
        return subprocess.CompletedProcess(["sh", "-c", line], finished.exit_code, finished.stdout, finished.stderr)
