from tests.stories.core.support.fixtures import MainEnvironment


def project_folder(story):
    folder = story.home.folder.parent / "project"
    folder.mkdir()
    return folder


def test_the_hook_trust_of_a_folder_without_a_programs_hooks_is_unwritten_for_the_launcher(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = project_folder(story)
    story.expect_success(f"program trust codex {folder}", "unwritten")
    story.expect_success(f"program trust claude {folder}", "unwritten")


def test_the_launcher_gets_each_programs_command_line_from_its_provider(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = project_folder(story)
    story.expect_text(f"program command claude {folder} --launch launch-1", "claude", "--model", "--dangerously-skip-permissions", "--session-id")
    story.expect_text(f"program command codex {folder} --launch launch-1 --resume t-1", "codex", "--no-daemon", "--dangerously-bypass-approvals-and-sandbox", "t-1")


def test_a_person_who_asks_for_prompts_gets_no_skip_flag(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = project_folder(story)
    story.expect_absent(f"program command claude {folder} --launch launch-1 --ask-prompts", "--dangerously-skip-permissions")


def test_a_program_no_module_provides_is_refused_naming_it(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = project_folder(story)
    story.expect_refusal(f"program command gemini {folder} --launch launch-1", "gemini")
