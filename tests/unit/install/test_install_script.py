import hashlib
import json
import os
import subprocess
from pathlib import Path

INSTALL = Path(__file__).resolve().parents[3] / "install.sh"
NAME = "journal-hook-linux-amd64"
STARTS = "#!/bin/sh\necho journal-hook test\n"


def release(folder: Path, program: str = STARTS, listed_checksum: str | None = None) -> Path:
    folder.mkdir()
    (folder / NAME).write_text(program)
    checksum = listed_checksum or hashlib.sha256(program.encode()).hexdigest()
    (folder / "checksums.txt").write_text(f"{checksum}  {NAME}\n")
    return folder


def installed(project: Path, release_folder: Path, platform: str = "linux/amd64") -> subprocess.CompletedProcess[str]:
    project.mkdir(exist_ok=True)
    environment = {**os.environ, "JOURNAL_RELEASE_URL": release_folder.as_uri(), "JOURNAL_PLATFORM": platform}
    return subprocess.run(["sh", str(INSTALL)], cwd=project, env=environment, capture_output=True, text=True, timeout=30)


def hook_commands(path: Path) -> set[str]:
    return {hook["command"] for blocks in json.loads(path.read_text())["hooks"].values() for block in blocks for hook in block["hooks"]}


def test_the_binary_for_the_machine_is_installed_and_both_programs_call_it_by_its_full_path(tmp_path):
    project = tmp_path / "project"
    run = installed(project, release(tmp_path / "release"))
    binary = project / ".journal" / "bin" / "journal-hook"
    assert run.returncode == 0, run.stderr
    assert binary.read_text() == STARTS
    assert hook_commands(project / ".claude" / "settings.local.json") == {f'"{binary}" claude "{project}"'}
    assert hook_commands(project / ".codex" / "hooks.json") == {f'"{binary}" codex "{project}"'}


def test_a_binary_whose_checksum_differs_from_the_release_is_not_installed(tmp_path):
    project = tmp_path / "project"
    run = installed(project, release(tmp_path / "release", listed_checksum="0" * 64))
    assert run.returncode == 1 and "does not match" in run.stderr
    assert not (project / ".journal" / "bin" / "journal-hook").exists() and not (project / ".claude").exists()


def test_a_platform_no_binary_is_built_for_is_refused_with_the_way_to_build_one(tmp_path):
    run = installed(tmp_path / "project", release(tmp_path / "release"), platform="plan9/amd64")
    assert run.returncode == 1 and "go build ./tools/journal-hook" in run.stderr
