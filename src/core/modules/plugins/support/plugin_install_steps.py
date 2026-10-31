import json
import subprocess
from pathlib import Path

from core.base.refusal import Refusal
from core.base.type_guards import is_mapping
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_program import PluginProgram

STEP_LIMIT_SECONDS = 600


class PluginInstallSteps:
    """The steps a plugin's manifest asks of its install, as version 4 ran them: each program it requires found,
    its setup steps run in order in its folder, and its installed command's answer read as its settings."""

    def __init__(self, program: PluginProgram) -> None:
        self.program = program

    def check_requirements(self, manifest: PluginManifest, folder: Path) -> None:
        for requirement in manifest.requirements:
            if self.shell(requirement.check, manifest.name, folder).returncode != 0:
                raise Refusal(f"{requirement.name} is missing: {requirement.hint}", "install it, then install the plugin again")

    def run_setup(self, manifest: PluginManifest, folder: Path) -> None:
        for step in manifest.setup_steps:
            if self.shell(step.line, manifest.name, folder).returncode != 0:
                raise Refusal(f"the setup step {step.name} failed", "fix what it needs and install the plugin again")

    def installed_settings(self, manifest: PluginManifest, folder: Path) -> dict[str, object]:
        if not manifest.installed_command:
            return {}
        run = self.shell(manifest.installed_command, manifest.name, folder)
        lines = [line for line in run.stdout.splitlines() if line.strip()]
        answer: object = json.loads(lines[-1]) if run.returncode == 0 and lines else None
        return {str(key): value for key, value in answer.items()} if is_mapping(answer) else {}

    def shell(self, line: str, plugin_name: str, folder: Path) -> "subprocess.CompletedProcess[str]":
        return subprocess.run(["sh", "-c", line], cwd=folder, env=self.program.environment(plugin_name, ""), capture_output=True, text=True,
                              timeout=STEP_LIMIT_SECONDS)
