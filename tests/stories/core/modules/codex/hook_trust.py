from tests.stories.core.support.fixtures import MainEnvironment


def test_the_hook_trust_of_a_folder_without_the_journals_codex_hooks_is_unwritten_for_the_launcher(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = story.home.folder.parent / "project"
    folder.mkdir()
    story.expect_success(f"codex hook-trust {folder}", "unwritten")
