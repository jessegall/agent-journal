from functools import cache
import hashlib
import os
import shutil
import subprocess
import time
from pathlib import Path

TOOLS_FOLDER = Path(__file__).resolve().parents[4] / "tools"
CACHE_FOLDER = Path.home() / ".cache" / "agent-journal" / "go-builds"
BUILD_TIMEOUT_SECONDS = 180
UNUSED_BUILD_SECONDS = 7 * 24 * 3600
HASH_CHARACTERS = 16
SOURCE_PATTERNS = ("*.go", "go.mod", "go.sum")


class GoBuild:
    """Builds one of the repository's Go programs statically and under a time limit, once for each version
    of the Go sources: the build is kept in a cache and copied into a story's folder. It also gives the clean
    environment the stories run them in, so no journal variable of this session leaks in."""

    @classmethod
    def built(cls, program: str, binary: Path) -> Path:
        if not binary.exists():
            shutil.copy(cls.kept_build(program), binary)
        return binary

    @classmethod
    def kept_build(cls, program: str) -> Path:
        folder = CACHE_FOLDER / cls.source_hash()
        kept = folder / program
        if not kept.exists():
            cls.remove_unused_builds()
            folder.mkdir(parents=True, exist_ok=True)
            partial = folder / f"{program}.{os.getpid()}"
            subprocess.run(["go", "build", "-o", str(partial), "."], cwd=TOOLS_FOLDER / program, check=True, timeout=BUILD_TIMEOUT_SECONDS,
                           capture_output=True, env={**os.environ, "CGO_ENABLED": "0"})
            partial.replace(kept)
        return kept

    @staticmethod
    @cache
    def source_hash() -> str:
        digest = hashlib.sha1()
        for path in sorted(path for pattern in SOURCE_PATTERNS for path in TOOLS_FOLDER.rglob(pattern)):
            digest.update(str(path.relative_to(TOOLS_FOLDER)).encode())
            digest.update(path.read_bytes())
        return digest.hexdigest()[:HASH_CHARACTERS]

    @staticmethod
    def remove_unused_builds() -> None:
        limit = time.time() - UNUSED_BUILD_SECONDS
        for unused in (path for path in CACHE_FOLDER.iterdir() if path.stat().st_mtime < limit) if CACHE_FOLDER.is_dir() else ():
            shutil.rmtree(unused, ignore_errors=True)

    @staticmethod
    def environment(**values: str) -> dict[str, str]:
        return {"PATH": os.environ.get("PATH", ""), "HOME": os.environ.get("HOME", ""), "USER": "story", **values}
