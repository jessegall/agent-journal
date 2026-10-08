import json
import re
import shutil
import tarfile
import tempfile
import time
from dataclasses import dataclass
from pathlib import Path

SUFFIX = ".tar.gz"
SHOWN = 25
ROW = re.compile(r"^[^/]+/([a-z_]+)/(\d+)(?:\.md|/\1\.md)$")
FRONT = re.compile(r"\A---\n(.*?)\n---\n", re.S)
STAMPED = re.compile(r"-\d+$")
REMOVE_TRIES, REMOVE_AGAIN = 10, 0.2


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
    aside = attic / f".{name}.removing"
    source.rename(aside)
    removed(aside)
    return target


def removed(source: Path) -> None:
    for _ in range(REMOVE_TRIES):
        try:
            shutil.rmtree(source)
            return
        except FileNotFoundError:
            return
        except OSError:
            time.sleep(REMOVE_AGAIN)
    shutil.rmtree(source)


def compress(root: Path) -> list[str]:
    attic = folder(root)
    done = []
    for kept in sorted(p for p in attic.iterdir() if p.is_dir() and not p.name.startswith(".")) if attic.is_dir() else ():
        pack(kept, kept.name)
        done.append(kept.name)
    return done


def latest(root: Path, env: str) -> Path | None:
    stamps = {p: p.name[len(env) + 1:-len(SUFFIX)] for p in folder(root).glob(f"{env}-*{SUFFIX}")}
    found = sorted([(0, p) for p in folder(root).glob(f"{env}{SUFFIX}")] + [(int(stamp), p) for p, stamp in stamps.items() if stamp.isdigit()])
    return found[-1][1] if found else None


def unpack(archive: Path, home: Path) -> Path:
    with tempfile.TemporaryDirectory(dir=home.parent) as scratch:
        with tarfile.open(archive, "r:gz") as tar:
            tar.extractall(scratch, filter="data")
        (Path(scratch) / archive.name[:-len(SUFFIX)]).rename(home)
    archive.unlink()
    return home


@dataclass(frozen=True)
class AtticHit:
    environment: str
    ref: str
    title: str


def searched(root: Path, term: str) -> list[AtticHit]:
    want, hits = term.lower(), []
    for archive in sorted(folder(root).glob(f"*{SUFFIX}"), key=lambda p: p.stat().st_mtime, reverse=True):
        hits += archive_hits(archive, want)
        if len(hits) >= SHOWN:
            break
    return hits[:SHOWN]


def archive_hits(archive: Path, want: str) -> list[AtticHit]:
    environment, found, logged = STAMPED.sub("", archive.name[:-len(SUFFIX)]), [], False
    try:
        with tarfile.open(archive, "r:gz") as tar:
            for member in tar:
                parts = member.name.split("/")
                if parts[1:2] == ["environments"]:
                    return []
                logged = logged or parts[1:] == ["events.jsonl"]
                row = ROW.match(member.name)
                if not row or not member.isfile():
                    continue
                text = tar.extractfile(member).read().decode(errors="replace")
                if want in text.lower():
                    found.append(AtticHit(environment, f"{row[1]}:{int(row[2])}", title_of(text)))
    except (tarfile.TarError, OSError, EOFError):
        return []
    return found if logged else []


def title_of(text: str) -> str:
    front = FRONT.match(text)
    try:
        return json.loads(front.group(1)).get("title", "") if front else text.split("\n", 1)[0]
    except json.JSONDecodeError:
        return ""
