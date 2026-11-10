from pathlib import Path

from engine.hosting.hosting import Hosting
from engine.hosting.host_probe import HostProbe
from engine.hosting.errors.missing_cgroup_refusal import MissingCgroupRefusal
from engine.hosting.errors.missing_systemd_refusal import MissingSystemdRefusal
from engine.hosting.errors.unsupported_kernel_refusal import UnsupportedKernelRefusal
from engine.hosting.errors.shared_user_refusal import SharedUserRefusal
from engine.hosting.errors.writable_hosted_file_refusal import WritableHostedFileRefusal
from engine.hosting.errors.wrong_socket_mode_refusal import WrongSocketModeRefusal

LINUX_KERNEL = "Linux"
SYSTEMD_FOLDER = Path("/run/systemd/system")
CGROUP_CONTROLLERS = Path("/sys/fs/cgroup/cgroup.controllers")
ROOT_ID = 0
GROUP_WORLD_EDIT_MASK = 0o022
SOCKET_MODE = 0o660


class HostedStartCheck:
    """Refuses to start a hosted journal on a host that cannot keep its agents contained; a local journal passes."""

    def __init__(self, hosting: Hosting, probe: HostProbe, hosted_file: Path) -> None:
        self.hosting, self.probe, self.hosted_file = hosting, probe, hosted_file

    def check_host(self) -> None:
        if not self.hosting.is_hosted:
            return
        if self.probe.kernel_name() != LINUX_KERNEL:
            raise UnsupportedKernelRefusal.wrong_kernel(self.probe.kernel_name())
        if not self.probe.has_path(SYSTEMD_FOLDER):
            raise MissingSystemdRefusal.no_systemd()
        if not self.probe.has_path(CGROUP_CONTROLLERS):
            raise MissingCgroupRefusal.no_cgroup()
        if self.hosting.mode.agent_user == self.probe.journal_user_name():
            raise SharedUserRefusal.same_user(self.hosting.mode.agent_user)
        self.check_hosted_file()

    def check_hosted_file(self) -> None:
        if self.probe.owner_id(self.hosted_file) != ROOT_ID:
            raise WritableHostedFileRefusal.wrong_owner(self.hosted_file, self.probe.owner_id(self.hosted_file))
        if self.probe.mode_bits(self.hosted_file) & GROUP_WORLD_EDIT_MASK:
            raise WritableHostedFileRefusal.wrong_mode(self.hosted_file, self.probe.mode_bits(self.hosted_file))

    def check_socket(self, socket: Path) -> None:
        if self.hosting.is_hosted and self.probe.mode_bits(socket) != SOCKET_MODE:
            raise WrongSocketModeRefusal.wrong_mode(socket, self.probe.mode_bits(socket))
