from pathlib import Path

from engine.hosting.host_probe import HostProbe
from engine.hosting.hosted_start_check import CGROUP_CONTROLLERS, SYSTEMD_FOLDER


class FakeHost(HostProbe):
    """A host whose kernel facts are set by the story: by default a safe Linux host."""

    def __init__(self, kernel: str = "Linux", paths: frozenset[Path] = frozenset({SYSTEMD_FOLDER, CGROUP_CONTROLLERS}),
                 journal_user: str = "journal", file_owner: int = 0, file_mode: int = 0o644, socket_mode: int = 0o660) -> None:
        self.kernel, self.paths, self.journal_user = kernel, paths, journal_user
        self.file_owner, self.file_mode, self.socket_mode = file_owner, file_mode, socket_mode

    def kernel_name(self) -> str:
        return self.kernel

    def has_path(self, path: Path) -> bool:
        return path in self.paths

    def journal_user_name(self) -> str:
        return self.journal_user

    def owner_id(self, path: Path) -> int:
        return self.file_owner

    def mode_bits(self, path: Path) -> int:
        return self.socket_mode if path.suffix == ".sock" else self.file_mode
