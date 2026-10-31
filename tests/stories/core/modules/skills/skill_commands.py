from core.base.command.bus import Bus
from core.base.registry.registry import Registry
from core.base.database.database import Database
from core.modules.skills.commands.load_skill import LoadSkill
from core.modules.skills.commands.reset_skills import ResetSkills
from tests.stories.core.modules.skills.agent_skills import GOOD
from tests.stories.core.support.coding_fixtures import BuilderStarted


def started(new_story):
    return new_story(GOOD, fixture=BuilderStarted)


def current_digest(story, skill: str) -> str:
    return next(entry.digest for entry in Registry.read(story.container.get(Database)).skills if entry.folder == skill)


def test_require_makes_a_skill_due_for_an_agent(new_story):
    story = started(new_story)
    story.expect_success(f"skill require {story.agent.id} journal-notes", "state: due", "skill: journal-notes")
    story.expect_success(f"agent-skill list --agent {story.agent.id}", f"1  {story.agent.id}  journal-notes  due")


def test_require_of_a_skill_no_module_declares_is_refused(new_story):
    story = started(new_story)
    story.expect_refusal(f"skill require {story.agent.id} journal-gone", "no module declares the skill journal-gone")


def test_require_does_nothing_for_a_skill_the_agent_holds_loaded_in_its_current_text(new_story):
    story = started(new_story)
    story.run(f"skill require {story.agent.id} journal-notes")
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-notes", current_digest(story, "journal-notes")), story.agent)
    story.expect_success(f"skill require {story.agent.id} journal-notes", "state: loaded")


def test_require_makes_a_skill_read_in_an_older_text_due_again(new_story):
    story = started(new_story)
    story.run(f"skill require {story.agent.id} journal-notes")
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-notes", "an-old-digest"), story.agent)
    story.expect_success(f"skill require {story.agent.id} journal-notes", "state: due")


def test_a_second_load_of_the_same_digest_changes_nothing(new_story):
    story = started(new_story)
    bus, command = story.container.get(Bus), LoadSkill(story.agent.id, "journal-notes", "abc123")
    bus.run(command, story.agent)
    bus.run(command, story.agent)
    story.expect_success("agent-skill show 1", "state: loaded", "version: 2", "digest: abc123")


def test_reset_removes_the_loaded_rows_of_the_agent_and_keeps_the_due_ones(new_story):
    story = started(new_story)
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-notes", "abc123"), story.agent)
    story.run(f"skill require {story.agent.id} journal-tasks")
    story.container.get(Bus).run(ResetSkills(story.agent.id), story.agent)
    story.expect_refusal("agent-skill show 1", "no agent-skill 1")
    story.expect_success("agent-skill show 2", "state: due")
