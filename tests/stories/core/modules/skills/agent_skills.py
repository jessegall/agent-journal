from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.tool_type import ToolType
from core.base.skill.skill_digest import SkillDigest
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.skills.support.skill_samples import PATH
from tests.stories.core.support.coding_fixtures import BuilderStarted

GOOD = f"{PATH}:GoodSkillsModule"
NOTES_FILE = ".claude/skills/journal-notes/SKILL.md"


def read_of(story, relative: str, session: str = "s-1"):
    path = str(story.home.project_folder / relative)
    sample = HookSamples.sample("pre_tool_use", {"name": "Read", "category": ToolType.READ, "files": [path], "diff": None})
    return story.hook(session, sample.with_fields(session=session))


def started(new_story):
    story = new_story(GOOD, fixture=BuilderStarted)
    story.run("skill write")
    return story


def due_notes(story) -> None:
    story.expect_success(f"agent-skill make {story.agent.id} journal-notes", "state: due")


def test_a_skill_made_due_for_an_agent_is_a_due_row(new_story):
    story = started(new_story)
    due_notes(story)
    story.expect_success("agent-skill list", f"{story.agent.id}  journal-notes  due")
    story.expect_success("agent-skill unread " + str(story.agent.id), "journal-notes")


def test_a_tool_call_that_reads_the_skill_file_marks_it_loaded_with_the_files_digest(new_story):
    story = started(new_story)
    due_notes(story)
    read_of(story, NOTES_FILE)
    story.expect_success("agent-skill show 1", "state: loaded")
    story.expect_absent("agent-skill unread " + str(story.agent.id), "journal-notes")
    story.expect_success("agent-skill show 1", f"digest: {SkillDigest.digest((story.home.project_folder / NOTES_FILE).read_text())}")


def test_a_second_read_changes_nothing(new_story):
    story = started(new_story)
    due_notes(story)
    read_of(story, NOTES_FILE)
    story.run("agent-skill show 1")
    read_of(story, NOTES_FILE)
    story.expect_success("agent-skill show 1", "version: 2", "state: loaded")


def test_a_skill_whose_text_changed_since_it_was_read_counts_as_unread(new_story):
    story = started(new_story)
    due_notes(story)
    copy = story.home.project_folder / NOTES_FILE
    copy.write_text("an older text of the skill")
    read_of(story, NOTES_FILE)
    story.expect_success("agent-skill unread " + str(story.agent.id), "journal-notes")


def test_a_compaction_clears_the_agents_loaded_rows(new_story):
    story = started(new_story)
    due_notes(story)
    read_of(story, NOTES_FILE)
    story.hook("s-1", HookSamples.sample("compact"))
    story.expect_success("agent-skill unread " + str(story.agent.id), "journal-notes")


def test_a_skill_gone_from_the_catalogue_is_dropped_from_due(new_story):
    story = started(new_story)
    story.run(f"agent-skill make {story.agent.id} journal-gone")
    due_notes(story)
    story.expect_absent("agent-skill unread " + str(story.agent.id), "journal-gone")


def test_each_agent_has_its_own_loaded_rows(new_story):
    story = started(new_story)
    helper = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    due_notes(story)
    story.run(f"agent-skill make {helper.id} journal-notes")
    read_of(story, NOTES_FILE)
    story.expect_absent("agent-skill unread " + str(story.agent.id), "journal-notes")
    story.expect_success("agent-skill unread " + str(helper.id), "journal-notes")
