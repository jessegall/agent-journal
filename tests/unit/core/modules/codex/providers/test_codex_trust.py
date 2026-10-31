from pathlib import Path

import pytest

from core.base.provider.hook_trust import HookTrust
from core.modules.codex.providers.support.codex_trust import CodexTrust

HOOKS = Path("/work/app/.codex/hooks.json")
HOOK_NAMES = ["SessionStart", "PreToolUse", "Stop"]


def config(tmp_path: Path, states: list[str]) -> Path:
    path = tmp_path / "config.toml"
    path.write_text("".join(f'[hooks.state."{HOOKS}:{state}:0:0"]\nenabled = true\n\n' for state in states))
    return path


@pytest.mark.parametrize(("states", "trust"), [([], HookTrust.UNTRUSTED), (["session_start", "pre_tool_use"], HookTrust.CHANGED),
                                               (["session_start", "pre_tool_use", "stop"], HookTrust.READY)])
def test_a_hook_files_trust_is_read_from_codexs_config(tmp_path, states, trust):
    assert CodexTrust(config(tmp_path, states)).trust(HOOKS, HOOK_NAMES) is trust


def test_a_worktrees_hook_file_takes_the_trust_of_the_main_checkouts(tmp_path):
    settings = config(tmp_path, ["session_start", "pre_tool_use", "stop"])
    worktree_hooks = Path("/work/app/.journal/worktrees/w1/.codex/hooks.json")
    CodexTrust(settings).copied(HOOKS, worktree_hooks)
    assert CodexTrust(settings).trust(worktree_hooks, HOOK_NAMES) is HookTrust.READY
