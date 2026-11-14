from pathlib import Path

from engine.enums.tool_type import ToolType
from engine.module.driver_entries import DRIVERS_MODULE
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from core.modules.drivers.models.hook_call import HookCall
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from tests.stories.core.modules.skills.due import JOURNAL_TASK_LIST, due_lines, environment, start

SKILL_RULE = "skills.read-first"
SKILL_STATE = "skills.load-required"


def records(story, sample) -> dict[str, dict]:
    reply = story.hook("s-1", sample)
    rows = story.container.get(Queries).query(HookCall).find(reply.hook_call_id).metadata.module_part(DRIVERS_MODULE)["rules"]
    return {row["rule"]: row for row in rows}


def read_every_due_skill(story) -> None:
    listed = due_lines(story)
    for skill in story.container.get(SkillCatalogue).skills():
        if f"  {skill.folder}  due" in listed:
            story.hook("s-1", HookSamples.sample("pre_tool_use", {"name": "Read", "category": ToolType.READ, "files": [str(Path(skill.path))], "diff": None}))
    story.run_listeners()


def test_an_agent_with_a_skill_due_has_the_load_state_open_and_its_rule_is_asked(new_story):
    story = environment(new_story)
    start(story)
    rows = records(story, JOURNAL_TASK_LIST)
    story.expect_rows(SKILL_RULE in rows, "is not open" not in rows[SKILL_RULE].get("reason", ""), detail=str(rows))


def test_with_every_due_skill_read_the_state_closes_and_the_rule_is_recorded_allowed_without_being_asked(new_story):
    story = environment(new_story)
    start(story)
    read_every_due_skill(story)
    rows = records(story, JOURNAL_TASK_LIST)
    story.expect_rows(rows[SKILL_RULE]["outcome"] == "allowed", rows[SKILL_RULE].get("reason") == f"{SKILL_STATE} is not open", rows[SKILL_RULE].get("milliseconds", 0) == 0, detail=str(rows))
