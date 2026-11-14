import json
from pathlib import Path

from engine.testing.examples.hook_samples import HookSamples
from core.modules.skills.rules.skill_read_first_rule import SkillReadFirstRule
from tests.stories.core.modules.skills.due import DUE, expect_due, expect_skills_absent
from tests.stories.core.modules.skills.kept_after_compaction import CompactingClaude, FIRST_TOOL_USE, kept_skill_records, skill_body


class Reads:
    """How often the read-first rule went to the transcript for the skills the program put back, counted while hooks run."""

    def __init__(self, monkeypatch) -> None:
        self.count = 0
        discarded = SkillReadFirstRule.not_kept

        def counted(rule, hook, names):
            self.count += 1
            return discarded(rule, hook, names)

        monkeypatch.setattr(SkillReadFirstRule, "not_kept", counted)


def compacted_session(story, folder: Path) -> dict[str, str]:
    """Starts the session again after a compaction; the program writes its record of the kept skills after that hook."""
    transcript = folder / "session.jsonl"
    transcript.write_text("")
    raw = {"source": "compact", "transcript_path": str(transcript)}
    story.hook("s-1", HookSamples.session_start().with_fields(program="claude").with_raw(raw))
    story.run_listeners()
    expect_due(story, "journal-notes", "journal-chores")
    transcript.write_text("".join(json.dumps(record) + "\n" for record in kept_skill_records(folder, {"journal-notes": skill_body(story, "journal-notes")})))
    return {"transcript_path": str(transcript)}


def tool_use(raw: dict[str, str], event: str):
    return FIRST_TOOL_USE.with_fields(program="claude", event=event).with_raw(raw)


def test_a_tool_use_stores_its_answer_first_and_the_kept_skill_is_loaded_when_the_listeners_run(new_story, tmp_path):
    story = new_story(DUE, fixture=CompactingClaude)
    raw = compacted_session(story, tmp_path)
    story.hook("s-1", tool_use(raw, "post_tool_use"))
    expect_due(story, "journal-notes", "journal-chores")
    story.run_listeners()
    expect_skills_absent(story, "journal-notes")
    expect_due(story, "journal-chores")


def test_the_next_tool_use_reads_the_rows_and_not_the_transcript(new_story, tmp_path, monkeypatch):
    story = new_story(DUE, fixture=CompactingClaude)
    raw = compacted_session(story, tmp_path)
    story.hook("s-1", tool_use(raw, "post_tool_use"))
    story.run_listeners()
    reads = Reads(monkeypatch)
    reply = story.hook("s-1", tool_use(raw, "pre_tool_use"))
    story.expect_rows(reads.count == 0, "journal-notes" not in str(reply.lines), not reply.refusal, detail=f"{reads.count} {reply.lines} {reply.refusal}")
    expect_due(story, "journal-chores")


def test_a_tool_use_before_the_record_answers_from_the_transcript_and_one_after_it_answers_the_same_from_the_rows(new_story, tmp_path, monkeypatch):
    story = new_story(DUE, fixture=CompactingClaude)
    raw = compacted_session(story, tmp_path)
    reads = Reads(monkeypatch)
    previous = story.hook("s-1", tool_use(raw, "pre_tool_use"))
    from_transcript = reads.count
    story.hook("s-1", tool_use(raw, "post_tool_use"))
    story.run_listeners()
    after = story.hook("s-1", tool_use(raw, "pre_tool_use"))
    expect_due(story, "journal-chores")
    story.expect_rows(from_transcript >= 1, reads.count == from_transcript,
                      "journal-notes" not in str(previous.lines), "journal-notes" not in str(after.lines), not previous.refusal, not after.refusal,
                      detail=f"{from_transcript} {reads.count} {previous.lines} {after.lines}")
