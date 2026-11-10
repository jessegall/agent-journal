import json
from collections.abc import Mapping
from pathlib import Path

from core.base.provider.transcript_tail import TranscriptTail
from core.base.skill.skill_digest import SkillDigest
from engine.types.type_guards import is_list, is_mapping, is_text_mapping

KEPT_SKILLS_TYPE = "invoked_skills"
COMPACT_BOUNDARY = "compact_boundary"
RECORD_WINDOW_BYTES = 4 * 1024 * 1024
CONTENT_SEPARATOR = "\n\n"


class ClaudeKeptSkills:
    """The skills Claude Code put back into the context after a compaction, read from the record it writes into the
    session transcript just after the compaction, each with the digest of the text it put back."""

    def __init__(self, transcript: Path) -> None:
        self.transcript = transcript

    def digests(self) -> Mapping[str, str]:
        for line in reversed(TranscriptTail(self.transcript).tail_lines(RECORD_WINDOW_BYTES)):
            record = self.record(line)
            if record.get("subtype") == COMPACT_BOUNDARY:
                return {}
            attachment = record.get("attachment")
            if is_mapping(attachment) and attachment.get("type") == KEPT_SKILLS_TYPE:
                return self.skill_digests(attachment.get("skills"))
        return {}

    @staticmethod
    def record(line: str) -> Mapping[str, object]:
        try:
            fields: object = json.loads(line)
        except ValueError:
            return {}
        return fields if is_text_mapping(fields) else {}

    @staticmethod
    def skill_digests(skills: object) -> Mapping[str, str]:
        if not is_list(skills):
            return {}
        return {str(skill["name"]): SkillDigest.digest(str(skill["content"]).partition(CONTENT_SEPARATOR)[2].strip())
                for skill in skills if is_mapping(skill) and "name" in skill and "content" in skill}
