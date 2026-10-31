from core.base.skill.skill_digest import SkillDigest
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.skills.agent_skills import NOTES_FILE, read_of, started


def test_a_read_of_a_skill_file_marks_it_loaded_with_the_digest_of_the_catalogue_text(new_story):
    story = started(new_story)
    story.run(f"skill require {story.agent.id} journal-notes")
    read_of(story, NOTES_FILE)
    story.expect_success("agent-skill show 1", "state: loaded", f"digest: {SkillDigest.digest((story.home.project_folder / NOTES_FILE).read_text())}")


def test_a_read_of_a_skill_not_made_due_loads_it_too(new_story):
    story = started(new_story)
    read_of(story, NOTES_FILE)
    story.expect_success("agent-skill show 1", "state: loaded", "skill: journal-notes")


def test_a_read_of_any_other_file_loads_nothing(new_story):
    story = started(new_story)
    read_of(story, "README.md")
    story.expect_refusal("agent-skill show 1", "no agent-skill 1")


def test_a_compaction_removes_the_loaded_rows_of_the_agent(new_story):
    story = started(new_story)
    read_of(story, NOTES_FILE)
    story.hook("s-1", HookSamples.sample("compact"))
    story.run_listeners()
    story.expect_refusal("agent-skill show 1", "no agent-skill 1")
