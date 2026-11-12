from engine.journal.journal_home import JournalHome
from engine.provider.hook_manager import HookManager
from engine.provider.managed_hooks import ManagedHooks
from engine.provider.program_hooks import ProgramHooks
from core.modules.codex.providers.codex_provider import CodexProvider


def test_an_import_without_existing_codex_trust_does_not_create_trust(tmp_path, monkeypatch):
    monkeypatch.setenv("CODEX_HOME", str(tmp_path / "codex"))
    project = tmp_path / "project"
    home = JournalHome(project / ".journal")
    ProgramHooks.store(project / CodexProvider.hook_file.path, {"hooks": {
        "PreToolUse": [{"hooks": [{"type": "command", "command": "project-check"}]}]}})
    HookManager(project, ManagedHooks(home)).import_hooks(CodexProvider, project)
    assert not (tmp_path / "codex/config.toml").exists()
