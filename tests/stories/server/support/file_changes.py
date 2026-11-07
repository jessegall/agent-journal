import ctypes
import os
import select
import sys
from pathlib import Path


class FileChanges:
    """Waits for writes in a folder and its existing files."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder
        self.watched: set[Path] = set()
        self.descriptors: list[int] = []
        if sys.platform == "darwin":
            self.queue = select.kqueue()
            self.fd = self.queue.fileno()
        else:
            self.libc = ctypes.CDLL(None, use_errno=True)
            self.fd = self.libc.inotify_init1(os.O_NONBLOCK | os.O_CLOEXEC)
            if self.fd < 0:
                raise OSError(ctypes.get_errno(), "inotify_init1")
        self.refresh()

    def refresh(self) -> None:
        paths = [self.folder, *self.folder.iterdir()]
        for path in paths:
            if path in self.watched or (path != self.folder and not path.is_file()):
                continue
            if sys.platform == "darwin":
                try:
                    descriptor = os.open(path, os.O_RDONLY)
                except FileNotFoundError:
                    continue
                self.descriptors.append(descriptor)
                event = select.kevent(descriptor, filter=select.KQ_FILTER_VNODE, flags=select.KQ_EV_ADD | select.KQ_EV_CLEAR,
                                      fflags=select.KQ_NOTE_WRITE | select.KQ_NOTE_EXTEND | select.KQ_NOTE_RENAME | select.KQ_NOTE_DELETE)
                self.queue.control([event], 0)
            else:
                if self.libc.inotify_add_watch(self.fd, os.fsencode(path), 0x00000FCE) < 0:
                    continue
            self.watched.add(path)

    def wait(self, timeout: float) -> bool:
        readable, _, _ = select.select([self.fd], [], [], timeout)
        if not readable:
            return False
        if sys.platform == "darwin":
            self.queue.control(None, 100, 0)
        else:
            os.read(self.fd, 65536)
        self.refresh()
        return True

    def close(self) -> None:
        for descriptor in self.descriptors:
            os.close(descriptor)
        if sys.platform == "darwin":
            self.queue.close()
        else:
            os.close(self.fd)

    def __enter__(self) -> "FileChanges":
        return self

    def __exit__(self, *details: object) -> None:
        self.close()
