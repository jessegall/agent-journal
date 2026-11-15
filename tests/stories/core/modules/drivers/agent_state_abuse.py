from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.expectations.expected_nudge import expected_nudge
from core.modules.drivers.nudges.database_file_nudge import DatabaseFileNudge
from tests.integration.core.modules.drivers.test_agent_states_lifecycle import SkillsDueAgent, read_every_due_skill
from tests.stories.core.modules.skills.due import DUE
from tests.stories.core.support.agent_labels import agent_number

# words a command would carry if it moved an agent in or out of a state
STATE_MOVES = {"open", "close", "push", "pop", "enter", "leave", "clear"}
DATABASE_WRITE = HookSamples.shell("sqlite3 .journal/version-5.db \"UPDATE agent_skills SET state = 'loaded'\"",
                                   ShellPart("sqlite3", CommandCategory.EDIT, [".journal/version-5.db", "UPDATE agent_skills SET state = 'loaded'"]))


def in_place(story) -> str:
    shown = story.run(f"driver states {agent_number(story, story.agent.id)}", actor=story.agent).output_text
    return next(line for line in shown.splitlines() if line.startswith(("in_place:", "in place:")))


def test_no_driver_command_moves_an_agent_into_or_out_of_a_state(new_story):
    story = new_story(DUE, fixture=SkillsDueAgent)
    shown = story.run("driver --help", actor=story.agent).output_text
    verbs = {line.split()[0] for line in shown.splitlines()[1:] if line.strip()}
    story.expect_rows("states" in verbs, "state-types" in verbs, not verbs & STATE_MOVES, detail=shown)


def test_a_shell_line_that_writes_the_database_leaves_the_due_skill_state_open(new_story):
    story = new_story(DUE, fixture=SkillsDueAgent)
    story.expect_hook_refusal("s-1", DATABASE_WRITE, expected_nudge(DatabaseFileNudge.declared()))
    story.run_listeners()
    story.expect_rows("skills.load-required (agent_skill:" in in_place(story), detail=in_place(story))


def test_reading_the_due_skills_is_the_way_out_and_the_state_shows_closed(new_story):
    story = new_story(DUE, fixture=SkillsDueAgent)
    story.expect_rows("skills.load-required (agent_skill:" in in_place(story), detail=in_place(story))
    read_every_due_skill(story)
    story.expect_rows("skills.load-required" not in in_place(story), detail=in_place(story))


def test_a_read_only_look_at_the_database_is_allowed_and_a_redirect_into_it_is_refused(new_story):
    story = new_story(DUE, fixture=SkillsDueAgent)
    read = HookSamples.shell("sqlite3 -readonly .journal/version-5.db 'SELECT 1'", ShellPart("sqlite3", CommandCategory.READ, ["-readonly", ".journal/version-5.db", "SELECT 1"]))
    story.expect_hook_allowed("s-1", read)
    redirect = HookSamples.shell("echo x > .journal/version-5.db", ShellPart("echo", CommandCategory.READ, ["x"]), redirects=[".journal/version-5.db"])
    story.expect_hook_refusal("s-1", redirect, expected_nudge(DatabaseFileNudge.declared()))
