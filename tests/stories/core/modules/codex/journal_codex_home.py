import json
import os
import tomllib
from pathlib import Path

from engine.provider.program_hooks import ProgramHooks
from tests.stories.core.support.fixtures import MainEnvironment

PERSON_HOOK = {"matcher": "", "hooks": [{"type": "command", "command": "person-codex-check"}]}
ROLLOUT = "rollout-2026-11-12T00-00-00-t-1.jsonl"


def person_folder() -> Path:
    return Path(os.environ["CODEX_HOME"])


def journal_folder(story) -> Path:
    return story.home.folder / "programs" / "codex"


def person_files() -> list[Path]:
    folder = person_folder()
    (folder / "sessions" / "2026" / "11" / "12").mkdir(parents=True, exist_ok=True)
    (folder / "sessions" / "2026" / "11" / "12" / ROLLOUT).write_text(json.dumps({"type": "session_meta", "payload": {"cwd": "/work/app"}}) + "\n")
    (folder / "auth.json").write_text('{"token": "before"}\n')
    (folder / "config.toml").write_text('model = "gpt-6.1-sol"\n')
    ProgramHooks.store(folder / "hooks.json", {"hooks": {"PreToolUse": [PERSON_HOOK]}})
    return [folder / "auth.json", folder / "config.toml", folder / "hooks.json"]


def test_a_codex_launch_reads_only_the_journal_s_codex_folder(new_story):
    story = new_story(fixture=MainEnvironment)
    root = story.home.project_folder
    files = person_files()
    previous = [path.read_bytes() for path in files]
    worktrees = [story.home.folder / "worktrees" / "development" / name for name in ("worker-1", "worker-2")]
    for worktree in worktrees:
        worktree.mkdir(parents=True)
    terminal = json.loads(story.run(f'program command codex "{root}" --launch launch-1 --format json').output_text)
    asking = json.loads(story.run(f'program command codex "{root}" --launch launch-2 --ask-prompts --format json').output_text)
    story.expect_success(f'program trust codex "{root}"', "ready")
    story.expect_text(f'program manage codex "{root}"', "managed hooks:")
    config = tomllib.loads((journal_folder(story) / "config.toml").read_text())
    unchanged_person_files = [path.read_bytes() for path in files] == previous
    (journal_folder(story) / "auth.json").write_text('{"token": "refreshed"}\n')
    story.expect_rows(terminal["variables"] == {"CODEX_HOME": str(journal_folder(story))}, unchanged_person_files,
                      "person-codex-check" not in (journal_folder(story) / "hooks.json").read_text(),
                      (person_folder() / "auth.json").read_text() == '{"token": "refreshed"}\n',
                      (journal_folder(story) / "sessions" / "2026" / "11" / "12" / ROLLOUT).is_file(),
                      {str(root), *(str(worktree.resolve()) for worktree in worktrees)} <= set(config["projects"]),
                      "--dangerously-bypass-approvals-and-sandbox" not in asking["arguments"],
                      'approval_policy="on-request"' in asking["arguments"] and 'sandbox_mode="workspace-write"' in asking["arguments"],
                      any(copy.name.endswith("-config.toml") for copy in (story.home.folder / "backups" / "program-settings" / "codex").iterdir()))
