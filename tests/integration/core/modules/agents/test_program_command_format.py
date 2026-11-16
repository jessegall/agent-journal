import json

from core.modules.claude_code.providers.support.managed_hooks import ManagedHooks
from tests.stories.core.support.fixtures import MainEnvironment


def test_the_json_form_gives_the_arguments_and_only_the_launch_variables(played):
    story = played(MainEnvironment)
    root = story.home.project_folder
    codex = json.loads(story.run(f'program command codex "{root}" --launch launch-1 --format json').output_text)
    claude = json.loads(story.run(f'program command claude "{root}" --launch launch-2 --format json').output_text)
    story.expect_rows(codex["arguments"][0] == "codex", codex["variables"] == {"CODEX_HOME": str(story.home.folder / "programs" / "codex")},
                      claude["arguments"][0] == "claude", claude["variables"] == {"CLAUDE_CODE_STOP_HOOK_BLOCK_CAP": "1000000"}, set(codex) == {"arguments", "variables"})


def test_an_older_launcher_cannot_start_codex_and_still_gets_claude_s_line(played):
    story = played(MainEnvironment)
    root = story.home.project_folder
    story.expect_refusal(f'program command codex "{root}" --launch launch-1',
                         "Codex starts only with the journal's own settings folder, which this launcher does not pass")
    story.expect_text(f'program command claude "{root}" --launch launch-2', "claude\n--settings")


def test_a_launch_names_the_managed_settings_file_that_blocks_hooks(played, monkeypatch, tmp_path):
    story = played(MainEnvironment)
    managed_file = tmp_path / "managed-settings.json"
    managed_file.write_text(json.dumps({"allowManagedHooksOnly": True}))
    monkeypatch.setattr(ManagedHooks, "files", (managed_file,))
    story.expect_refusal(f'program command claude "{story.home.project_folder}" --launch launch-1 --format json',
                         f"Claude Code's managed settings in {managed_file} allow only managed hooks, so the journal's hooks would not run")
