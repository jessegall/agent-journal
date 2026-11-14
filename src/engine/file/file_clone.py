from engine.file.file_access import FileAccess
import ctypes
import os
import shutil
import sys
from pathlib import Path

MAC_PLATFORM = "darwin"


class FileClone:
    """Copies a file by sharing its blocks with the source where the file system can, as APFS does, so a large
    template database costs no time and no disk until it is written to; anywhere else it copies the bytes."""

    @staticmethod
    def copy(source: Path, target: Path) -> None:
        FileAccess.unlink(target, missing_ok=True)
        if sys.platform != MAC_PLATFORM or ctypes.CDLL(None, use_errno=True).clonefile(os.fsencode(source), os.fsencode(target), 0) != 0:
            FileAccess.copyfile(source, target)
