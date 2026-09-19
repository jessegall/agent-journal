import shutil
import tarfile
import tempfile
from pathlib import Path

SUFFIX = ".tar.gz"


def folder(root: Path) -> Path:
    return Path(root) / "attic"


def pack(source: Path, name: str) -> Path:
    attic = folder(source.parents[1])
    attic.mkdir(exist_ok=True)
    target = attic / f"{name}{SUFFIX}"
    partial = target.with_name(f".{target.name}.partial")
    with tarfile.open(partial, "w:gz") as tar:
        tar.add(source, arcname=name)
    with tarfile.open(partial, "r:gz") as tar:
        packed = {m.name for m in tar.getmembers()}
    wanted = {name, *(f"{name}/{p.relative_to(source).as_posix()}" for p in source.rglob("*"))}
    if packed != wanted:
        partial.unlink()
        raise OSError(f"{source.name} did not pack whole; it is left where it was")
    partial.rename(target)
    shutil.rmtree(source)
    return target


def compress(root: Path) -> list[str]:
    attic = folder(root)
    done = []
    for kept in sorted(p for p in attic.iterdir() if p.is_dir()) if attic.is_dir() else ():
        pack(kept, kept.name)
        done.append(kept.name)
    return done


def latest(root: Path, env: str) -> Path | None:
    stamps = {p: p.name[len(env) + 1:-len(SUFFIX)] for p in folder(root).glob(f"{env}-*{SUFFIX}")}
    found = sorted((int(stamp), p) for p, stamp in stamps.items() if stamp.isdigit())
    return found[-1][1] if found else None


def unpack(archive: Path, home: Path) -> Path:
    with tempfile.TemporaryDirectory(dir=home.parent) as scratch:
        with tarfile.open(archive, "r:gz") as tar:
            tar.extractall(scratch, filter="data")
        (Path(scratch) / archive.name[:-len(SUFFIX)]).rename(home)
    archive.unlink()
    return home
