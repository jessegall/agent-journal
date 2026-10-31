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


def fallback_commands(project: Path, program: str) -> set[str]:
    return {f'sh "{project}/.journal/hooks/hook.sh" {program} "{project}"'}


def test_a_platform_no_binary_is_built_for_falls_back_to_hook_sh_and_says_so(tmp_path):
    project = tmp_path / "project"
    run = installed(project, release(tmp_path / "release"), platform="plan9/amd64")
    assert run.returncode == 0 and "no journal-hook is built for plan9/amd64" in run.stdout
    assert hook_commands(project / ".claude" / "settings.local.json") == fallback_commands(project, "claude")
    assert (project / ".journal" / "hooks" / "hook.sh").is_file()


def test_a_binary_that_does_not_start_falls_back_to_hook_sh_for_both_programs(tmp_path):
    project = tmp_path / "project"
    run = installed(project, release(tmp_path / "release", program="#!/bin/sh\nexit 1\n"))
    assert run.returncode == 0 and "does not start on this machine" in run.stdout
    assert hook_commands(project / ".codex" / "hooks.json") == fallback_commands(project, "codex")


def test_a_release_without_the_binary_falls_back_to_hook_sh(tmp_path):
    empty = tmp_path / "release"
    empty.mkdir()
    run = installed(tmp_path / "project", empty)
    assert run.returncode == 0 and "the release has no journal-hook-linux-amd64" in run.stdout


RUNNER = "journal-run-linux-amd64"


def with_runner(folder: Path, program: str = STARTS, listed_checksum: str | None = None) -> Path:
    (folder / RUNNER).write_text(program)
    checksum = listed_checksum or hashlib.sha256(program.encode()).hexdigest()
    listed = (folder / "checksums.txt").read_text()
    (folder / "checksums.txt").write_text(f"{listed}{checksum}  {RUNNER}\n")
    return folder


def test_the_runner_of_the_release_is_installed_beside_the_hook_binary_and_checked(tmp_path):
    project = tmp_path / "project"
    run = installed(project, with_runner(release(tmp_path / "release")))
    assert run.returncode == 0 and (project / ".journal" / "bin" / "journal-run").read_text() == STARTS
    assert f"shell lines run through {project}/.journal/bin/journal-run" in run.stdout


def test_a_release_without_the_runner_still_installs_the_hooks_and_says_lines_run_as_written(tmp_path):
    project = tmp_path / "project"
    run = installed(project, release(tmp_path / "release"))
    assert run.returncode == 0 and f"the release has no {RUNNER}, so shell lines run as the agent wrote them" in run.stdout
    assert (project / ".journal" / "bin" / "journal-hook").exists() and not (project / ".journal" / "bin" / "journal-run").exists()


def test_a_runner_whose_checksum_differs_stops_the_install_and_one_that_does_not_start_is_dropped(tmp_path):
    project = tmp_path / "project"
    run = installed(project, with_runner(release(tmp_path / "release"), listed_checksum="0" * 64))
    assert run.returncode == 1 and "does not match" in run.stderr and not (project / ".claude").exists()
    other = tmp_path / "other"
    run = installed(other, with_runner(release(tmp_path / "second"), program="#!/bin/sh\nexit 1\n"))
    assert run.returncode == 0 and "does not start on this machine" in run.stdout and not (other / ".journal" / "bin" / "journal-run").exists()
