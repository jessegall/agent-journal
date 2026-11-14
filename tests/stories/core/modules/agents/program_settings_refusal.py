import os
from pathlib import Path

from core.modules.agents.support.program_settings_nudges import PROGRAM_SETTINGS_BAN
from engine.enums.command_category import CommandCategory
from engine.enums.command_effect import CommandEffect
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderStarted

SETTINGS_EDIT = [CommandEffect.WRITES_FILES]
SHELL_WRITES = [("sed", ["-i", "s/never/on-request/"]), ("chmod", ["u+w"]), ("rm", ["-f"]), ("mv", ["/tmp/mine.json"]), ("ln", ["-sf", "/tmp/mine.json"])]


def ban() -> str:
    return PROGRAM_SETTINGS_BAN.nudge().text


def spelled_paths(story) -> list[str]:
    worktree = story.home.folder / "worktrees" / "development" / "worker-1" / ".journal" / "programs" / "codex" / "hooks.json"
    return [".journal/programs/claude/settings.json", str(story.home.folder / "programs" / "codex" / "config.toml"),
            str((story.home.folder / "programs" / "codex" / "hooks.json").resolve()), str(worktree), ".journal/bin/journal-hook",
            ".journal/hooks/hook.sh", ".journal/runtime/program-settings.json", ".journal/backups/program-settings/claude/x-settings.json"]


def shell_edit(program: str, arguments: list[str], path: str):
    line = " ".join([program, *arguments, path])
    return HookSamples.shell(line, ShellPart(program, CommandCategory.EDIT, [*arguments, path], effects=SETTINGS_EDIT, output_paths=[path]))


def test_every_agent_write_of_the_journal_s_settings_is_refused_in_every_spelling_and_role(new_story):
    story = new_story(fixture=BuilderStarted)
    worker = story.new_row_id(f"agent start s-2 claude worker --parent {story.agent.id} --environment main")
    helper = story.new_row_id(f"agent start s-3 claude helper --parent {story.agent.id} --environment main")
    settings_file = story.home.folder / "programs" / "claude" / "settings.json"
    for session in ("s-1", "s-2", "s-3"):
        story.expect_hook_refusal(session, HookSamples.edit(str(settings_file)), ban())
    for path in spelled_paths(story):
        story.expect_hook_refusal("s-1", HookSamples.edit(path), ban())
        story.expect_hook_refusal("s-2", HookSamples.shell(f"echo x > {path}", ShellPart("echo", CommandCategory.EDIT, ["x"]), redirects=[f"> {path}"]), ban())
    for program, arguments in SHELL_WRITES:
        story.expect_hook_refusal("s-1", shell_edit(program, arguments, ".journal/programs/codex/config.toml"), ban())
    story.expect_rows(worker > 0, helper > 0)


def test_reading_the_journal_s_settings_and_editing_the_person_s_own_pass(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_allowed("s-1", HookSamples.shell("cat .journal/programs/claude/settings.json",
                                                       ShellPart("cat", CommandCategory.READ, [".journal/programs/claude/settings.json"])))
    person_settings = str(Path(os.environ["CLAUDE_CONFIG_DIR"]) / "settings.json")
    story.expect_hook_allowed("s-1", HookSamples.edit(person_settings))


def test_the_refusal_has_no_skip(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_refusal("s-1", HookSamples.edit(".journal/programs/claude/settings.json"), ban())
    outcome = story.run("refusal skip agents.program-settings --reason 'the file is wrong'", actor=story.agent)
    story.expect_rows(outcome.code != 0, "safety" in outcome.output_text.lower() or "no skip" in outcome.output_text.lower())
