import json

from tests.stories.core.support.fixtures import MainEnvironment


def journal_hook_commands(story) -> set[str]:
    programs = story.home.folder / "programs"
    claude = json.loads((programs / "claude" / "settings.json").read_text())["hooks"]
    codex = json.loads((programs / "codex" / "hooks.json").read_text())["hooks"]
    return {entry["command"] for hooks in (claude, codex) for blocks in hooks.values() for block in blocks for entry in block["hooks"]}


def test_the_shell_runner_the_install_chose_is_in_both_programs_files_and_the_hooks_page_warns(new_story):
    story = new_story(fixture=MainEnvironment)
    root = story.home.project_folder
    shell_runner = f'sh "{story.home.folder}/hooks/hook.sh"'
    choice = story.home.folder / "hooks" / "runner"
    choice.parent.mkdir(parents=True, exist_ok=True)
    choice.write_text(f"{shell_runner}\n")
    story.expect_text(f'program command claude "{root}" --launch launch-1', "--settings")
    story.expect_text(f'program manage codex "{root}"', "managed hooks:")
    page = json.loads(story.run("managed-hook list --json").output_text)
    story.expect_rows(journal_hook_commands(story) == {f'{shell_runner} claude "{root}"', f'{shell_runner} codex "{root}"'}, page["fallback"] is True)
