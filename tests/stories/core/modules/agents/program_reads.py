from core.modules.agents.commands.program_command.program_command_subcommand import FIRST_PROMPT
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value


def project_folder(story):
    folder = story.home.folder.parent / "project"
    folder.mkdir()
    return folder


def test_the_hook_trust_of_a_folder_without_a_programs_hooks_is_unwritten_for_the_launcher(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = project_folder(story)
    story.expect_success(f"program trust codex {folder}", "unwritten")
    story.expect_success(f"program trust claude {folder}", "unwritten")


def test_the_launcher_passes_the_person_s_flags_over_the_defaults(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = project_folder(story)
    story.expect_text(f"program command claude {folder} --launch launch-1", "--model\nopus", "--effort\nhigh")
    line = f"program command claude {folder} --launch launch-1 --program-argument=--model --program-argument=haiku"
    story.expect_text(line, "--model\nhaiku", "--effort\nhigh")
    story.expect_absent(line, "opus")


def test_a_person_who_asks_for_prompts_gets_no_skip_flag(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = project_folder(story)
    story.expect_absent(f"program command claude {folder} --launch launch-1 --ask-prompts", "--dangerously-skip-permissions")


def test_a_program_no_module_provides_is_refused_naming_it(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = project_folder(story)
    story.expect_refusal(f"program command gemini {folder} --launch launch-1", "gemini")


def test_a_new_or_resumed_main_agent_starts_with_the_journals_first_prompt_last(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = project_folder(story)
    for line in (f"program command claude {folder} --launch launch-1", f"program command claude {folder} --launch launch-1 --resume s-1",
                 f"program command codex {folder} --launch launch-1", f"program command codex {folder} --launch launch-1 --resume t-1"):
        output_text = story.run(line).output_text.splitlines()
        expect_value(output_text[-1], FIRST_PROMPT)


def test_a_person_who_gave_arguments_gets_no_first_prompt(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = project_folder(story)
    story.expect_absent(f"program command claude {folder} --launch launch-1 --program-argument=--model --program-argument=haiku", FIRST_PROMPT)


def test_a_resumed_session_starts_with_the_model_and_effort_it_last_reported_or_the_defaults(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = project_folder(story)
    save_status_file(story, "s-1", {"model": {"id": "claude-fable-5-2", "display_name": "Fable 5.2"}, "effort": {"level": "medium"}})
    line = f"program command claude {folder} --launch launch-1 --resume s-1"
    story.expect_text(line, "--model\nclaude-fable-5-2", "--effort\nmedium")
    story.expect_absent(line, "opus")
    story.expect_text(f"program command claude {folder} --launch launch-1 --resume s-2", "--model\nopus", "--effort\nhigh")
