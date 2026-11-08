import json
from pathlib import Path

from core.base.skill.skill_contents import SkillContents
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.skill_requirement import SkillRequirement
from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.skills.due import DUE, expect_due, expect_skills_absent, start
from tests.stories.core.support.coding_fixtures import CodingEnvironment

PRE_COMPACT = HookSamples.sample("compact").with_fields(accepts_lines=False)
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


def transcript_with_kept_skills(folder: Path, skills: dict[str, str]) -> Path:
    kept = [{"name": name, "path": f"projectSettings:{name}", "content": f"Base directory for this skill: {folder}\n\n{body}"} for name, body in skills.items()]
    records = [{"type": "system", "subtype": "compact_boundary"}, {"type": "user", "message": {"content": "summary"}},
               {"attachment": {"type": "invoked_skills", "skills": kept}}]
    path = folder / "session.jsonl"
    path.write_text("".join(json.dumps(record) + "\n" for record in records))
    return path


def compacted(story, transcript: Path) -> None:
    story.hook("s-1", HookSamples.session_start().with_raw({"source": "compact", "transcript_path": str(transcript)}))
    story.run_listeners()


def test_a_skill_claude_code_put_back_after_a_compaction_counts_as_loaded(new_story, tmp_path):
    story = new_story(DUE, fixture=CompactingClaude)
    compacted(story, transcript_with_kept_skills(tmp_path, {"journal-notes": skill_body(story, "journal-notes")}))
    expect_skills_absent(story, "journal-notes")
    expect_due(story, "journal-chores")


def test_a_skill_put_back_in_an_older_text_is_still_due(new_story, tmp_path):
    story = new_story(DUE, fixture=CompactingClaude)
    compacted(story, transcript_with_kept_skills(tmp_path, {"journal-notes": "# Notes\n\nAn older text."}))
    expect_due(story, "journal-notes", "journal-chores")


def test_a_codex_session_has_every_skill_due_after_a_compaction(new_story, tmp_path):
    story = new_story(DUE, fixture=SkillsAfterCompaction)
    start(story, HookSamples.session_start().with_fields(program="codex"))
    story.hook("s-1", PRE_COMPACT.with_fields(program="codex"))
    story.run_listeners()
    transcript = transcript_with_kept_skills(tmp_path, {"journal-notes": skill_body(story, "journal-notes")})
    story.hook("s-1", HookSamples.session_start().with_fields(program="codex").with_raw({"source": "compact", "transcript_path": str(transcript)}))
    story.run_listeners()
    expect_due(story, "journal-notes", "journal-chores")
