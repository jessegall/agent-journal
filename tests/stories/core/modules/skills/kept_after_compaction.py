import json
from pathlib import Path

from core.base.driver.command_category import CommandCategory
from core.base.skill.skill_contents import SkillContents
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.skill_requirement import SkillRequirement
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.skills.due import DUE, expect_due, expect_skills_absent, start
from tests.stories.core.support.coding_fixtures import CodingEnvironment

PRE_COMPACT = HookSamples.sample("compact").with_fields(accepts_lines=False)
FIRST_TOOL_USE = HookSamples.shell("journal overview", ShellPart("journal", CommandCategory.JOURNAL, ["overview"]))
AFTER_COMPACTION = '\'["journal-notes", "journal-chores"]\''


class SkillsAfterCompaction(StoryFixture):
    parent = CodingEnvironment

    def steps(self, story):
        story.container.bind(SkillRequirement, SkillRequirement())
        story.run("skill write")
        story.run(f"setting make journal.core.skills.after-compaction {AFTER_COMPACTION}")


class CompactingClaude(StoryFixture):
    parent = SkillsAfterCompaction

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


def compaction_written_after_its_start_hook(story, folder: Path, skills: dict[str, str], program: str = "claude", written_after: tuple[dict[str, object], ...] = (),
                                            earlier: tuple[dict[str, object], ...] = (), is_recorded: bool = True) -> None:
    """The real order: the session start hook of a compaction runs first, and only then does the program write its
    record of the skills it put back; the agent's first tool use comes after that."""
    transcript = folder / "session.jsonl"
    transcript.write_text("")
    raw = {"source": "compact", "transcript_path": str(transcript)}
    story.hook("s-1", HookSamples.session_start().with_fields(program=program).with_raw(raw))
    story.run_listeners()
    expect_due(story, *skills)
    transcript.write_text("".join(json.dumps(record) + "\n" for record in (*earlier, *kept_skill_records(folder, skills, is_recorded), *written_after)))
    story.hook("s-1", FIRST_TOOL_USE.with_fields(program=program).with_raw({"transcript_path": str(transcript)}))
    story.run_listeners()


def test_a_skill_claude_code_put_back_after_a_compaction_counts_as_loaded_at_the_first_tool_use(new_story, tmp_path):
    story = new_story(DUE, fixture=CompactingClaude)
    compaction_written_after_its_start_hook(story, tmp_path, {"journal-notes": skill_body(story, "journal-notes")})
    expect_skills_absent(story, "journal-notes")
    expect_due(story, "journal-chores")


def test_a_skill_put_back_counts_with_most_of_a_megabyte_written_between_the_record_and_the_first_tool_use(new_story, tmp_path):
    story = new_story(DUE, fixture=CompactingClaude)
    rows_between = tuple({"attachment": {"type": "deferred_tools", "text": "x" * 40_000}} for _ in range(20))
    compaction_written_after_its_start_hook(story, tmp_path, {"journal-notes": skill_body(story, "journal-notes")}, written_after=rows_between)
    expect_skills_absent(story, "journal-notes")


def test_every_skill_put_back_counts_so_the_first_tool_use_is_not_held(new_story, tmp_path):
    story = new_story(DUE, fixture=CompactingClaude)
    skills = {name: skill_body(story, name) for name in ("journal-notes", "journal-chores")}
    compaction_written_after_its_start_hook(story, tmp_path, skills)
    expect_skills_absent(story, "journal-notes", "journal-chores")


def test_a_skill_put_back_in_an_older_text_is_still_due(new_story, tmp_path):
    story = new_story(DUE, fixture=CompactingClaude)
    compaction_written_after_its_start_hook(story, tmp_path, {"journal-notes": "# Notes\n\nAn older text."})
    expect_due(story, "journal-notes", "journal-chores")


def test_only_the_latest_compactions_record_counts_when_a_second_compaction_comes_after_an_older_one(new_story, tmp_path):
    story = new_story(DUE, fixture=CompactingClaude)
    older = tuple(kept_skill_records(tmp_path, {"journal-notes": skill_body(story, "journal-notes")}))
    compaction_written_after_its_start_hook(story, tmp_path, {"journal-chores": skill_body(story, "journal-chores")}, earlier=older)
    expect_skills_absent(story, "journal-chores")
    expect_due(story, "journal-notes")


def test_the_record_of_an_older_compaction_does_not_count_while_the_latest_has_none_yet(new_story, tmp_path):
    story = new_story(DUE, fixture=CompactingClaude)
    older = tuple(kept_skill_records(tmp_path, {"journal-notes": skill_body(story, "journal-notes")}))
    compaction_written_after_its_start_hook(story, tmp_path, {}, earlier=older, is_recorded=False)
    expect_due(story, "journal-notes", "journal-chores")
