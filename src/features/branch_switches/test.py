import subprocess

import features
from controllers.types import Agents
from engine.record import Record
from resources.base import SYSTEM
from tests.kit import report


def test_a_checkout_that_changes_branch_is_marked_in_the_chat(tmp_path):
    features.load()

    def git(*args, cwd=tmp_path):
        return subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True, timeout=5, check=True)

    git("init", "-q", "-b", "main")
    git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "--allow-empty", "-m", "start")
    record = Record(tmp_path / ".journal", "t")
    marks = lambda session: [card["label"] for card in Agents(record, actor=SYSTEM).by_session(session).data.get("cards") or []]
    report(record, "working", "PostToolUse", cwd=str(tmp_path))
    git("switch", "-q", "-c", "custom-rule-checks")
    report(record, "working", "PostToolUse", cwd=str(tmp_path))
    report(record, "working", "PostToolUse", cwd=str(tmp_path))
    assert marks("claude-1") == ["The main checkout switched from main to custom-rule-checks"], \
        "a switch shows once, naming the checkout and both branches; the first look only notes where it stands"
    folder = tmp_path.parent / f"{tmp_path.name}-wt"
    git("worktree", "add", "-q", "-b", "worktree-ticket-16", str(folder))
    report(record, "working", "PostToolUse", session="claude-2", cwd=str(folder))
    assert marks("claude-2") == [f"Worktree {folder.name} started on worktree-ticket-16"], "a session starting in a worktree says which branch it starts on"
