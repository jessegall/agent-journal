from pathlib import Path

from core.base.provider.helper_launch import HelperLaunch
from core.base.provider.launch_command import LaunchCommand
from core.base.provider.provider import Provider
from core.base.provider.session_start import SessionStart


class WorkerResumeSample:
    def command(self, launch: LaunchCommand) -> LaunchCommand:
        # @righteous ArchitectureWorkersWorkerLaunchFunnelDetector
        return launch

    def start(self) -> LaunchCommand:
        # @sin ArchitectureWorkersWorkerLaunchFunnelDetector
        return LaunchCommand(["agent"], Path("/work"), {})

    def launch(self) -> HelperLaunch:
        # @sin ArchitectureWorkersWorkerLaunchFunnelDetector
        return HelperLaunch(Path("/work"), Path("/work"), "", "", SessionStart("session"), {}, brief="Fix the cart")


class WorkerCommand:
    def command(self, provider: Provider, launch: HelperLaunch) -> LaunchCommand:
        # @righteous ArchitectureWorkersWorkerLaunchFunnelDetector
        return provider.helper_command(launch)

    def start(self) -> LaunchCommand:
        # @righteous ArchitectureWorkersWorkerLaunchFunnelDetector
        return LaunchCommand(["agent"], Path("/work"), {})

    def launch(self) -> HelperLaunch:
        # @righteous ArchitectureWorkersWorkerLaunchFunnelDetector
        return HelperLaunch(Path("/work"), Path("/work"), "model", "", SessionStart("session"), {}, brief="Fix the cart")


class OtherProgram:
    def helper_command(self, launch: str) -> str:
        return launch

    def command(self, launch: str) -> str:
        # @righteous ArchitectureWorkersWorkerLaunchFunnelDetector
        return self.helper_command(launch)
