from pathlib import Path

from core.base.provider.helper_launch import HelperLaunch
from core.base.provider.launch_command import LaunchCommand
from core.base.provider.provider import Provider
from core.base.provider.session_start import SessionStart


class WorkerResumeSample:
    def command(self, launch: LaunchCommand) -> LaunchCommand:
        # @righteous architecture_workers_worker_launch_outside_worker_command
        return launch

    def start(self) -> LaunchCommand:
        # @sin architecture_workers_worker_launch_outside_worker_command
        return LaunchCommand(["agent"], Path("/work"), {})

    def launch(self) -> HelperLaunch:
        # @sin architecture_workers_worker_launch_outside_worker_command
        return HelperLaunch(Path("/work"), Path("/work"), "", "", SessionStart("session"), {}, brief="Fix the cart")


class WorkerCommand:
    def command(self, provider: Provider, launch: HelperLaunch) -> LaunchCommand:
        # @righteous architecture_workers_worker_launch_outside_worker_command
        return provider.helper_command(launch)

    def start(self) -> LaunchCommand:
        # @righteous architecture_workers_worker_launch_outside_worker_command
        return LaunchCommand(["agent"], Path("/work"), {})

    def launch(self) -> HelperLaunch:
        # @righteous architecture_workers_worker_launch_outside_worker_command
        return HelperLaunch(Path("/work"), Path("/work"), "model", "", SessionStart("session"), {}, brief="Fix the cart")


class SecondProgram:
    def helper_command(self, launch: str) -> str:
        return launch

    def command(self, launch: str) -> str:
        # @righteous architecture_workers_worker_launch_outside_worker_command
        return self.helper_command(launch)
