import re

from features import trigger
from features.parts import Context, ToolInterceptor
from features.skill_loading.catalogue import loaded_at
from skills import LIBRARY

NOUN = re.compile(r"(?:^|[\s;&|(])journal(?:\s+--\S+)*\s+([a-z]+)\b")


class NameSkillForCommand(ToolInterceptor):
    def intercept(self, context: Context, call) -> str:
        found = NOUN.search(call.command) if call.command else None
        library = context.record.root.parent / LIBRARY
        skill = next((f"journal-{name}" for name in (found.group(1), f"{found.group(1)}s") if (library / f"journal-{name}" / "SKILL.md").is_file()), "") if found else ""
        if not skill or not context.agent:
            return ""
        row = context.agent.row
        since = float(trigger.last(context.record, row.title, context.feature.name).get("since") or 0)
        at = float(loaded_at(row).get(skill) or 0)
        if not (at and at >= since) and context.once("needed", f"{since}:{skill}"):
            context.agent.whisper("needed", skill=skill, noun=found.group(1))
        return ""
