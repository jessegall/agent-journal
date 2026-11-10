from dataclasses import replace

from engine.actor.actor import Actor
from core.base.command.context import Context
from core.base.database.database import Database
from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.modules.skills.support.skill_requirement import SkillRequirement
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.skills.agent_skills import read_row
from tests.stories.core.modules.skills.due import drain_countdown
from tests.stories.core.support.coding_fixtures import BuilderStarted

PLAN_COMMAND = 'journal plan make "Rebuild" --brief "all of it" --environment main'
PHASE_COMMAND = 'journal phase make --plan 1 "Build" --goal "it builds"'
PLAN_REVIEWED = "journal plan reviewed 1"
CODEX_PLANNING = ".agents/skills/journal-planning/SKILL.md"


def journal_line(line: str, program: str):
    parts = line.split()
    return HookSamples.shell(line, ShellPart(parts[0], CommandCategory.JOURNAL, parts[1:], subcommand=parts[1])).with_fields(program=program)


def planner_story(new_story, program: str = "claude"):
    story = new_story(fixture=BuilderStarted)
    story.container.bind(SkillRequirement, SkillRequirement())
    story.run("skill write")
    if program != "claude":
        agent = story.container.get(Queries).query(Agent).find(story.agent.id)
        with story.container.get(Database).transaction():
            story.container.get(Repository).save(replace(agent, program=program), Context(Actor.core(), story.clock.timestamp(), ReadMessage(1)))
    return story


def read_skill(story, folder: str, program: str = "claude") -> None:
    skills_folder = ".claude/skills" if program == "claude" else ".agents/skills"
    read_row(story, f"{skills_folder}/{folder}/SKILL.md")


def test_a_codex_planner_is_sent_to_the_planning_skill_of_its_own_folder(new_story):
    story = planner_story(new_story, "codex")
    read_skill(story, "journal-plans", "codex")
    drain_countdown(story, journal_line(PLAN_COMMAND, "codex"), "journal-planning")
    story.expect_hook_refusal("s-1", journal_line(PLAN_COMMAND, "codex"), f"read this first: {CODEX_PLANNING}")
    read_skill(story, "journal-planning", "codex")
    story.expect_hook_allowed("s-1", journal_line(PLAN_COMMAND, "codex"))
