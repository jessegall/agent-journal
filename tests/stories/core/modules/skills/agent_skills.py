import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.database.database import Database
from engine.driver.command_category import CommandCategory
from engine.driver.tool_type import ToolType
from engine.skill.skill_digest import SkillDigest
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.processes.support.process_samples import start_process
from tests.stories.core.modules.skills.support.skill_samples import PATH
from tests.stories.core.support.coding_fixtures import BuilderStarted

GOOD = f"{PATH}:GoodSkillsModule"
NOTES_FILE = ".claude/skills/journal-notes/SKILL.md"


def read_row(story, relative: str, session: str = "s-1"):
    path = str(story.home.project_folder / relative)
    sample = HookSamples.sample("pre_tool_use", {"name": "Read", "category": ToolType.READ, "files": [path], "diff": None})
    reply = story.hook(session, sample.with_fields(session=session))
    story.run_listeners()
    return reply


def started(new_story):
    story = new_story(GOOD, fixture=BuilderStarted)
    story.run("skill write")
    return story


def due_notes(story) -> None:
    story.expect_text(f"skill require {story.agent.id} journal-notes --json", '"state": "due"')


def test_a_skill_made_due_for_an_agent_is_a_due_row(skill_files):
    story = skill_files
    due_notes(story)
    story.expect_success("agent-skill list", f"3  {story.agent.id}  journal-notes  due")
    story.expect_success("agent-skill unread " + str(story.agent.id), "journal-notes")


def test_a_second_read_changes_nothing(skill_files):
    story = skill_files
    due_notes(story)
    read_row(story, NOTES_FILE)
    read_row(story, NOTES_FILE)
    story.expect_success("agent-skill show 3", "version: 2", "state: loaded")


@pytest.fixture
def due_skill_files(skill_files):
    due_notes(skill_files)
    return skill_files


def test_a_skill_whose_text_changed_since_it_was_read_counts_as_unread(due_skill_files):
    story = due_skill_files
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-notes", "the-digest-of-an-older-text"), story.agent)
    story.expect_success("agent-skill unread " + str(story.agent.id), "journal-notes")


def test_a_compaction_clears_the_agents_loaded_rows(skill_files):
    story = skill_files
    due_notes(story)
    read_row(story, NOTES_FILE)
    story.hook("s-1", HookSamples.sample("compact"))
    story.run_listeners()
    story.expect_absent("agent-skill list --agent " + str(story.agent.id), "journal-notes")
    story.expect_absent("agent-skill unread " + str(story.agent.id), "journal-notes")


def test_a_skill_gone_from_the_catalogue_is_dropped_from_due(skill_files):
    story = skill_files
    story.run(f"skill require {story.agent.id} journal-gone")
    due_notes(story)
    story.expect_absent("agent-skill unread " + str(story.agent.id), "journal-gone")


def test_each_agent_has_its_own_loaded_rows(skill_files):
    story = skill_files
    helper = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    due_notes(story)
    story.run(f"skill require {helper.id} journal-notes")
    read_row(story, NOTES_FILE)
    story.expect_absent("agent-skill unread " + str(story.agent.id), "journal-notes")
    story.expect_success("agent-skill unread " + str(helper.id), "journal-notes")


@pytest.fixture
def skill_files(new_story):
    return started(new_story)


def test_a_shell_line_naming_one_skill_in_many_parts_reads_its_row_once(due_skill_files):
    story = due_skill_files
    connection = story.container.get(Database).connection
    statements: list[str] = []
    connection.set_trace_callback(statements.append)
    start_process(story, " && ".join(f"grep word{number} {story.home.project_folder / NOTES_FILE}" for number in range(12)), category=CommandCategory.READ)
    story.run_listeners()
    connection.set_trace_callback(None)
    expect_rows_loaded = [statement for statement in statements if statement.startswith("SELECT * FROM agent_skills WHERE session_agent_id") and "journal-notes" in statement]
    story.expect_rows(len(expect_rows_loaded) == 1, detail="\n".join(expect_rows_loaded))
    story.expect_success("agent-skill unread " + str(story.agent.id))
