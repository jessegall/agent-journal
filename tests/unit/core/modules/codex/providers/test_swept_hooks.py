from engine.journal.journal_home import JournalHome
from engine.private.private_folder import PrivateFolder
from engine.private.server_keys import ServerKeys
from core.base.provider.hook_manager import HookManager
from core.base.provider.hook_trust import HookTrust
from core.base.provider.hook_effect import HookEffect
from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.program_folders import ProgramFolders
from core.base.provider.program_hooks import ProgramHooks
from core.modules.codex.providers.codex_provider import CodexProvider
from core.modules.codex.providers.support.codex_trust import CAPITAL, CodexTrust


def test_a_sweep_preserves_the_journal_entries_existing_trust_at_their_new_positions(tmp_path, monkeypatch):
    codex_home = tmp_path / "codex home"
    codex_home.mkdir()
    monkeypatch.setenv("CODEX_HOME", str(codex_home))
    project = tmp_path / "project"
    home = JournalHome(project / ".journal")
    provider = CodexProvider(ProgramFolders(), ServerKeys(PrivateFolder(home)))
    hooks = ProgramHooks.hooks(CodexProvider, project)
    hooks.write('"/project/.journal/bin/journal-hook"', project)
    settings = hooks.settings()
    for blocks in settings["hooks"].values():
        blocks.insert(0, {"matcher": "", "hooks": [{"type": "command", "command": "project-check"}]})
    ProgramHooks.store(hooks.path, settings)
    config = codex_home / "config.toml"
    names = [CAPITAL.sub("_", event).lower() for event in provider.hook_events]
    hashes = CodexTrust.hashes(hooks.path)
    config.write_text("model = 'sample'\n" + "".join(
        CodexTrust.state_table(f"{hooks.path}:{name}:0:0", {"trusted_hash": "removed-project-hook"}) +
        CodexTrust.state_table(f"{hooks.path}:{name}:1:0", {"trusted_hash": hashes[f"{hooks.path}:{name}:1:0"]}) for name in names))
    managed = HookManager(project, ManagedHooks(home)).import_hooks(CodexProvider, project)
    assert next(hook for hook in managed if hook.event == "PreToolUse").effects == tuple([HookEffect.ADDS_LINES])
    assert next(hook for hook in managed if hook.event == "Stop").effects == tuple([HookEffect.CAN_REFUSE])
    assert provider.hook_trust(project) is HookTrust.READY
    states = provider.trust_record().states()
    for name in names:
        assert states[f"{hooks.path}:{name}:0:0"]["trusted_hash"] == hashes[f"{hooks.path}:{name}:1:0"]
    assert "model = 'sample'" in config.read_text()


def test_an_import_without_existing_codex_trust_does_not_create_trust(tmp_path, monkeypatch):
    monkeypatch.setenv("CODEX_HOME", str(tmp_path / "codex"))
    project = tmp_path / "project"
    home = JournalHome(project / ".journal")
    ProgramHooks.store(project / CodexProvider.hook_file.path, {"hooks": {
        "PreToolUse": [{"hooks": [{"type": "command", "command": "project-check"}]}]}})
    HookManager(project, ManagedHooks(home)).import_hooks(CodexProvider, project)
    assert not (tmp_path / "codex/config.toml").exists()
