import os
import subprocess
from pathlib import Path

HOOK = Path(__file__).resolve().parents[3] / "src" / "install" / "hook.sh"
STAND_IN_CURL = "#!/bin/sh\nprintf '%s\\n' \"$@\" > \"$CURL_ARGUMENTS\"\nprintf '{}'\n"


def project(folder: Path) -> Path:
    (folder / ".journal").mkdir(parents=True)
    (folder / ".git").mkdir()
    return folder


def curl_arguments(root: Path, folder: Path, tmp_path: Path, **variables: str) -> list[str]:
    bin_folder = tmp_path / "bin"
    bin_folder.mkdir(exist_ok=True)
    (bin_folder / "curl").write_text(STAND_IN_CURL)
    (bin_folder / "curl").chmod(0o755)
    arguments = tmp_path / "curl-arguments"
    environment = {"PATH": f"{bin_folder}:/usr/bin:/bin", "CURL_ARGUMENTS": str(arguments), **variables}
    subprocess.run(["sh", str(HOOK), "claude", str(root)], cwd=folder, env=environment, input="{}", capture_output=True, text=True, timeout=30, check=True)
    return arguments.read_text().splitlines() if arguments.exists() else []


def test_nothing_is_posted_unless_the_journal_is_on_for_the_shell(tmp_path):
    root = project(tmp_path / "project")
    assert curl_arguments(root, root, tmp_path) == []


def test_a_subagents_hook_never_reaches_the_journal(tmp_path):
    root = project(tmp_path / "project")
    assert curl_arguments(root, root, tmp_path, AGENT_JOURNAL_ACTIVE="1", JOURNAL_ACTOR="sub-agent") == []


def test_the_agents_hook_names_its_actor_and_the_environment_from_journal_env(tmp_path):
    root = project(tmp_path / "project")
    arguments = curl_arguments(root, root, tmp_path, AGENT_JOURNAL_ACTIVE="1", JOURNAL_ACTOR="worker:3", JOURNAL_ENV="cart")
    assert "X-Journal-Actor: worker:3" in arguments and "X-Journal-Env: cart" in arguments


def test_with_no_journal_env_a_linked_worktree_names_the_environment_and_the_main_checkout_is_main(tmp_path):
    root = project(tmp_path / "project")
    git_folder = tmp_path / "git" / "worktrees" / "cart"
    git_folder.mkdir(parents=True)
    (git_folder / "commondir").write_text("../..\n")
    worktree = tmp_path / "cart"
    worktree.mkdir()
    (worktree / ".git").write_text(f"gitdir: {git_folder}\n")
    assert "X-Journal-Env: cart" in curl_arguments(root, worktree, tmp_path, AGENT_JOURNAL_ACTIVE="1")
    assert "X-Journal-Env: main" in curl_arguments(root, root, tmp_path, AGENT_JOURNAL_ACTIVE="1")
