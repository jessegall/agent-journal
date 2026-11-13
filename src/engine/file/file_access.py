import io
import os
import shutil
import sys
import tempfile
from collections import OrderedDict
from collections.abc import Callable, Generator, Iterable, Iterator
from contextlib import contextmanager
from fnmatch import fnmatch
from pathlib import Path
from threading import RLock
from typing import IO, Any, ClassVar
from weakref import WeakValueDictionary

from engine.file.versions.file_contents import FileContents
from engine.file.versions.file_version import FileVersion
from engine.file.versions.file_changes import FileChanges

FILE_READ_EVENT = "journal.file.read"
FILE_CHANGE_EVENT = "journal.file.write"
CACHE_SIZE_FILES = 256


class FileAccess:
    """The one way to reach the file system: reads, writes, lists, walks, creates and deletes files and folders,
    retaining unchanged contents and invalidating each file when written."""

    contents: ClassVar[OrderedDict[Path, FileContents]] = OrderedDict()
    versions: ClassVar[WeakValueDictionary[Path, FileChanges]] = WeakValueDictionary()
    lock: ClassVar[RLock] = RLock()

    @classmethod
    def read(cls, file: Path | str, encoding: str | None = None, errors: str | None = None, newline: str | None = None) -> str:
        with io.TextIOWrapper(io.BytesIO(cls.binary(file)), encoding=encoding, errors=errors, newline=newline) as text:
            return text.read()

    # The text of a file as it is now, never from the cache: for a file the system changes on its own, such as one under
    # /proc.
    @classmethod
    def current(cls, file: Path | str) -> str:
        path = Path(file).resolve()
        sys.audit(FILE_READ_EVENT, str(path))
        return path.read_text()

    @classmethod
    def bytes_range(cls, file: Path | str, start: int, length: int) -> bytes:
        path = Path(file).resolve()
        sys.audit(FILE_READ_EVENT, str(path))
        with path.open("rb") as opened:
            opened.seek(start)
            return opened.read(length)

    @classmethod
    def binary(cls, file: Path | str) -> bytes:
        path = Path(file).resolve()
        sys.audit(FILE_READ_EVENT, str(path))
        with cls.lock:
            version = cls.version(path)
            kept = cls.contents.get(path)
            if kept is not None and kept.version == version:
                cls.contents.move_to_end(path)
                return kept.data
            data = path.read_bytes()
            cls.contents[path] = FileContents(version, data)
            cls.contents.move_to_end(path)
            if len(cls.contents) > CACHE_SIZE_FILES:
                cls.contents.popitem(last=False)
            return data

    @classmethod
    def version(cls, file: Path | str) -> FileVersion:
        path = Path(file).resolve()
        with cls.lock:
            status = path.stat()
            changes = cls.versions.get(path)
            if changes is None:
                changes = FileChanges()
                cls.versions[path] = changes
            return FileVersion(status.st_mtime_ns, status.st_size, status.st_ino, changes.version, changes)

    @classmethod
    def write(cls, file: Path | str, text: str, encoding: str | None = None, errors: str | None = None, newline: str | None = None) -> int:
        path = Path(file).resolve()
        with cls.lock:
            cls.invalidate(path)
            return path.write_text(text, encoding=encoding, errors=errors, newline=newline)

    @classmethod
    def write_binary(cls, file: Path | str, data: bytes) -> int:
        path = Path(file).resolve()
        with cls.lock:
            cls.invalidate(path)
            return path.write_bytes(data)

    @classmethod
    def update_timestamp(cls, file: Path | str, mode: int = 0o666, allow_existing: bool = True) -> None:
        path = Path(file).resolve()
        with cls.lock:
            cls.invalidate(path)
            path.touch(mode=mode, exist_ok=allow_existing)

    @classmethod
    @contextmanager
    def writer(cls, file: Path | str, mode: str = "w", encoding: str | None = None, errors: str | None = None,
               newline: str | None = None) -> Generator[IO[Any]]:
        path = Path(file).resolve()
        with cls.lock:
            cls.invalidate(path)
        try:
            with path.open(mode, encoding=encoding, errors=errors, newline=newline) as opened:
                yield opened
        finally:
            with cls.lock:
                cls.invalidate(path)

    @classmethod
    def lifetime_writer(cls, file: Path | str, mode: str = "a") -> IO[Any]:
        path = Path(file).resolve()
        with cls.lock:
            cls.invalidate(path)
        return path.open(mode)

    @classmethod
    @contextmanager
    def descriptor_writer(cls, file: Path | str, flags: int, permissions: int) -> Generator[int]:
        path = Path(file).resolve()
        with cls.lock:
            cls.invalidate(path)
        descriptor = os.open(path, flags, permissions)
        try:
            yield descriptor
        finally:
            with cls.lock:
                cls.invalidate(path)
            os.close(descriptor)

    @classmethod
    @contextmanager
    def private_writer(cls, file: Path | str) -> Generator[IO[str]]:
        with cls.descriptor_writer(file, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600) as descriptor:
            with os.fdopen(descriptor, "w", closefd=False) as output:
                yield output

    @classmethod
    @contextmanager
    def temporary_writer(cls, folder: Path, mode: str = "w", suffix: str = "") -> Generator[IO[Any]]:
        with tempfile.NamedTemporaryFile(mode=mode, suffix=suffix, dir=folder, delete=False) as output:
            path = Path(output.name)
            cls.invalidate(path)
            try:
                yield output
            finally:
                cls.invalidate(path)
                path.unlink(missing_ok=True)

    @classmethod
    def write_whole(cls, file: Path | str, data: bytes, mode: int) -> None:
        path = Path(file)
        with cls.temporary_writer(path.parent, "wb") as writing:
            writing.write(data)
            writing.flush()
            os.fsync(writing.fileno())
            os.chmod(writing.name, mode)
            cls.replace(writing.name, path)

    @classmethod
    def replace(cls, source: Path | str, target: Path | str) -> Path:
        source_path, target_path = Path(source), Path(target)
        with cls.lock:
            cls.invalidate(source_path.parent.resolve() / source_path.name)
            cls.invalidate(target_path.parent.resolve() / target_path.name)
            return source_path.replace(target_path)

    @classmethod
    def invalidate(cls, path: Path) -> None:
        changes = cls.versions.get(path)
        if changes is not None:
            changes.version += 1
        cls.contents.pop(path, None)
        sys.audit(FILE_CHANGE_EVENT, str(path))

    @classmethod
    def exists(cls, path: Path | str) -> bool:
        return Path(path).exists()

    @classmethod
    def is_file(cls, path: Path | str) -> bool:
        return Path(path).is_file()

    @classmethod
    def is_dir(cls, path: Path | str) -> bool:
        return Path(path).is_dir()

    @classmethod
    def is_symlink(cls, path: Path | str) -> bool:
        return Path(path).is_symlink()

    @classmethod
    def samefile(cls, path: Path | str, other: Path | str) -> bool:
        return Path(path).samefile(other)

    @classmethod
    def stat(cls, path: Path | str, follow_symlinks: bool = True) -> os.stat_result:
        return Path(path).stat(follow_symlinks=follow_symlinks)

    @classmethod
    def lstat(cls, path: Path | str) -> os.stat_result:
        return Path(path).lstat()

    @classmethod
    def readlink(cls, path: Path | str) -> Path:
        return Path(path).readlink()

    @classmethod
    def iterdir(cls, folder: Path | str) -> Iterator[Path]:
        return Path(folder).iterdir()

    @classmethod
    def glob(cls, folder: Path | str, pattern: str) -> Iterator[Path]:
        return Path(folder).glob(pattern, recurse_symlinks=False)

    # every path under a folder matching a name pattern, walked as walk() walks
    @classmethod
    def rglob(cls, folder: Path | str, pattern: str) -> Iterator[Path]:
        return (path for path in cls.walk(folder) if fnmatch(path.name, pattern))

    # every file and folder under a folder, walked as walk_folders() walks
    @classmethod
    def walk(cls, folder: Path | str) -> Iterator[Path]:
        for current, folder_names, file_names in cls.walk_folders(folder):
            yield from (current / name for name in (*folder_names, *file_names))

    # each folder under a folder with the names of its folders and files, as os.walk gives them: a symbolic link is never
    # followed, a folder is never entered twice, and a caller that removes a name from folder_names skips that folder
    @classmethod
    def walk_folders(cls, folder: Path | str) -> Iterator[tuple[Path, list[str], list[str]]]:
        entered: set[tuple[int, int]] = set()
        waiting = [Path(folder)]
        while waiting:
            current = waiting.pop()
            try:
                status = current.lstat()
                children = sorted(current.iterdir())
            except (FileNotFoundError, NotADirectoryError, PermissionError):
                continue
            if (status.st_dev, status.st_ino) in entered:
                continue
            entered.add((status.st_dev, status.st_ino))
            folder_names = [child.name for child in children if child.is_dir(follow_symlinks=False)]
            file_names = [child.name for child in children if not child.is_dir(follow_symlinks=False)]
            yield current, folder_names, file_names
            waiting.extend(current / name for name in reversed(folder_names))

    @classmethod
    @contextmanager
    def reader(cls, file: Path | str, mode: str = "r", encoding: str | None = None, errors: str | None = None) -> Generator[IO[Any]]:
        path = Path(file).resolve()
        sys.audit(FILE_READ_EVENT, str(path))
        with path.open(mode, encoding=encoding, errors=errors) as opened:
            yield opened

    @classmethod
    @contextmanager
    def temporary_folder(cls, prefix: str | None = None, folder: Path | str | None = None) -> Generator[Path]:
        with tempfile.TemporaryDirectory(prefix=prefix, dir=folder) as made:
            yield Path(made)

    # an empty temporary file the caller removes itself, with unlink
    @classmethod
    def make_temporary_file(cls, prefix: str | None = None, suffix: str | None = None) -> Path:
        descriptor, name = tempfile.mkstemp(prefix=prefix, suffix=suffix)
        os.close(descriptor)
        return Path(name)

    # a temporary folder the caller removes itself, with rmtree
    @classmethod
    def make_temporary_folder(cls, prefix: str | None = None, folder: Path | str | None = None) -> Path:
        return Path(tempfile.mkdtemp(prefix=prefix, dir=folder))

    @classmethod
    def mkdir(cls, folder: Path | str, mode: int = 0o777, parents: bool = False, exist_ok: bool = False) -> None:
        Path(folder).mkdir(mode=mode, parents=parents, exist_ok=exist_ok)

    @classmethod
    def touch(cls, file: Path | str, mode: int = 0o666, exist_ok: bool = True) -> None:
        cls.update_timestamp(file, mode, exist_ok)

    @classmethod
    def chmod(cls, path: Path | str, mode: int) -> None:
        Path(path).chmod(mode)

    @classmethod
    def symlink_to(cls, link: Path | str, target: Path | str, target_is_directory: bool = False) -> None:
        Path(link).symlink_to(target, target_is_directory)

    @classmethod
    def unlink(cls, file: Path | str, missing_ok: bool = False) -> None:
        path = Path(file)
        with cls.lock:
            cls.invalidate(path.parent.resolve() / path.name)
            path.unlink(missing_ok=missing_ok)

    @classmethod
    def rmdir(cls, folder: Path | str) -> None:
        Path(folder).rmdir()

    @classmethod
    def rmtree(cls, folder: Path | str, ignore_errors: bool = False) -> None:
        path = Path(folder)
        with cls.lock:
            cls.invalidate_folder(path)
            shutil.rmtree(path, ignore_errors=ignore_errors)

    @classmethod
    def rename(cls, source: Path | str, target: Path | str) -> Path:
        source_path, target_path = Path(source), Path(target)
        with cls.lock:
            cls.invalidate_folder(source_path)
            cls.invalidate_folder(target_path)
            return source_path.rename(target_path)

    @classmethod
    def move(cls, source: Path | str, target: Path | str) -> Path:
        with cls.lock:
            cls.invalidate_folder(Path(source))
            cls.invalidate_folder(Path(target))
            return Path(shutil.move(source, target))

    @classmethod
    def copy(cls, source: Path | str, target: Path | str) -> Path:
        with cls.lock:
            cls.invalidate_folder(Path(target))
            return Path(shutil.copy2(source, target))

    @classmethod
    def copyfile(cls, source: Path | str, target: Path | str) -> Path:
        with cls.lock:
            cls.invalidate_folder(Path(target))
            return Path(shutil.copyfile(source, target))

    @classmethod
    def copytree(cls, source: Path | str, target: Path | str, symlinks: bool = True, dirs_exist_ok: bool = False,
                 ignore: Callable[[str, list[str]], Iterable[str]] | None = None) -> Path:
        with cls.lock:
            cls.invalidate_folder(Path(target))
            return Path(shutil.copytree(source, target, symlinks=symlinks, dirs_exist_ok=dirs_exist_ok, ignore=ignore))

    @classmethod
    def invalidate_folder(cls, path: Path) -> None:
        resolved = path.parent.resolve() / path.name
        for kept in [kept for kept in cls.contents if kept == resolved or kept.is_relative_to(resolved)]:
            cls.invalidate(kept)
        cls.invalidate(resolved)
