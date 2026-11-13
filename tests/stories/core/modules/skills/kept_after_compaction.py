import json
from pathlib import Path

from engine.enums.command_category import CommandCategory
from engine.skill.skill_contents import SkillContents
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.skill_requirement import SkillRequirement
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.skills.due import DUE, expect_due, expect_skills_absent, start
from tests.stories.core.support.coding_fixtures import CodingEnvironment
from core.modules.skills.support.start_skills import AFTER_COMPACTION_KEY

PRE_COMPACT = HookSamples.sample("compact").with_fields(accepts_lines=False)
FIRST_TOOL_USE = HookSamples.shell("journal overview", ShellPart("journal", CommandCategory.JOURNAL, ["overview"]))
AFTER_COMPACTION = '\'["journal-notes", "journal-chores"]\''


class CompactionSkills(StoryFixture):
    parent = CodingEnvironment

    def steps(self, story):
        story.container.bind(SkillRequirement, SkillRequirement())
        story.run("skill write")
        story.run(f"setting make {AFTER_COMPACTION_KEY} {AFTER_COMPACTION}")


class CompactingClaude(StoryFixture):
    parent = CompactionSkills

    def steps(self, story):
        start(story)
        story.hook("s-1", PRE_COMPACT)
        story.run_listeners()


def skill_body(story, folder: str) -> str:
    entry = next(skill for skill in story.container.get(SkillCatalogue).skills() if skill.folder == folder)
    return SkillContents.read(Path(entry.path)).body


def kept_skill_records(folder: Path, skills: dict[str, str], is_recorded: bool = True) -> list[dict[str, object]]:
    kept = [{"name": name, "path": f"projectSettings:{name}", "content": f"Base directory for this skill: {folder}\n\n{body}"} for name, body in skills.items()]
    boundary = [{"type": "system", "subtype": "compact_boundary"}, {"type": "user", "message": {"content": "summary"}}]
    return [*boundary, {"attachment": {"type": "invoked_skills", "skills": kept}}] if is_recorded else boundary


def late_compaction_record(story, folder: Path, skills: dict[str, str], program: str = "claude", later_files: tuple[dict[str, object], ...] = (),
                                            previous_value: tuple[dict[str, object], ...] = (), is_recorded: bool = True) -> None:
    transcript = folder / "session.jsonl"
    transcript.write_text("")
    raw = {"source": "compact", "transcript_path": str(transcript)}
    story.hook("s-1", HookSamples.session_start().with_fields(program=program).with_raw(raw))
    story.run_listeners()
    expect_due(story, *skills)
    transcript.write_text("".join(json.dumps(record) + "\n" for record in (*previous_value, *kept_skill_records(folder, skills, is_recorded), *later_files)))
    story.hook("s-1", FIRST_TOOL_USE.with_fields(program=program).with_raw({"transcript_path": str(transcript)}))
    story.run_listeners()


def test_a_skill_claude_code_put_back_after_a_compaction_counts_as_loaded_at_the_first_tool_use(new_story, tmp_path):
    story = new_story(DUE, fixture=CompactingClaude)
    late_compaction_record(story, tmp_path, {"journal-notes": skill_body(story, "journal-notes")})
    expect_skills_absent(story, "journal-notes")
    expect_due(story, "journal-chores")
