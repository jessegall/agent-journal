import os
import platform
import pwd
import stat
from pathlib import Path


class HostProbe:
    """Reads the facts of the machine a hosted journal starts on; a story replaces it with a fake host."""

    def kernel_name(self) -> str:
        return platform.system()

    def has_path(self, path: Path) -> bool:
        return path.exists()

    def journal_user_name(self) -> str:
        return pwd.getpwuid(os.getuid()).pw_name

    def owner_id(self, path: Path) -> int:
        return path.stat().st_uid

    def mode_bits(self, path: Path) -> int:
        return stat.S_IMODE(path.stat().st_mode)
