import re

from features import trigger
from features.parts import Context, ToolInterceptor
from features.skill_loading.catalogue import loaded_at
from features.skill_loading.required import outstanding, require
from skills import LIBRARY

NOUN = re.compile(r"(?:^|[\s;&|(])journal(?:\s+--\S+)*\s+([a-z]+)\b")


class RequireCommandSkill(ToolInterceptor):
    def intercept(self, context: Context, call) -> str:
        found = NOUN.search(call.command) if call.command else None
        library = context.record.root.parent / LIBRARY
        skill = next((f"journal-{name}" for name in (found.group(1), f"{found.group(1)}s") if (library / f"journal-{name}" / "SKILL.md").is_file()), "") if found else ""
        if not skill or not context.agent:
            return ""
        row = context.agent.row
        since = float(trigger.last(context.record, row.title, context.feature.name).get("since") or 0)
        at = float(loaded_at(row).get(skill) or 0)
        if not at or at < since:
            require(context.record, row.title, {skill: since})
        return ""


class RefuseUntilLoaded(ToolInterceptor):
    limit = "most_refusals"

    def intercept(self, context: Context, call) -> str:
        if not context.agent:
            return ""
        missing = outstanding(context.record, context.agent.row)
        if not missing:
            return ""
        title, brief = context.feature.line("required", {"skills": ", ".join(missing), "loads": ", ".join(context.provider.skill_load(name) for name in missing)})
        return f"{title} - {brief}"
