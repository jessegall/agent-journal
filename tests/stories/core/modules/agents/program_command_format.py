import json

from tests.stories.core.support.fixtures import MainEnvironment


def test_the_json_form_gives_the_arguments_and_only_the_launch_variables(new_story):
    story = new_story(fixture=MainEnvironment)
    root = story.home.project_folder
    codex = json.loads(story.run(f'program command codex "{root}" --launch launch-1 --format json').output_text)
    claude = json.loads(story.run(f'program command claude "{root}" --launch launch-2 --format json').output_text)
    story.expect_rows(codex["arguments"][0] == "codex", codex["variables"] == {"CODEX_HOME": str(story.home.folder / "programs" / "codex")},
                      claude["arguments"][0] == "claude", claude["variables"] == {}, set(codex) == {"arguments", "variables"})


def test_an_older_launcher_cannot_start_codex_and_still_gets_claude_s_line(new_story):
    story = new_story(fixture=MainEnvironment)
    root = story.home.project_folder
    story.expect_refusal(f'program command codex "{root}" --launch launch-1',
                         "Codex starts only with the journal's own settings folder, which this launcher does not pass")
    story.expect_text(f'program command claude "{root}" --launch launch-2', "claude\n--settings")
