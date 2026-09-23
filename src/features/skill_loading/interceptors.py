import re
import time

from features import trigger
from features.parts import AgentContext, ToolInterceptor
from features.recital import mentioned
from features.skill_loading.catalogue import keywords, loaded_at
from features.skill_loading.required import outstanding, require
from skills import LIBRARY

NOUN = re.compile(r"(?:^|[\s;&|(])journal(?:\s+--\S+)*\s+([a-z]+)\b")


class RequireCommandSkill(ToolInterceptor):
    def intercept(self, context: AgentContext, call) -> str:
        found = NOUN.search(call.command) if call.command else None
        library = context.record.root.parent / LIBRARY
        skill = next((f"journal-{name}" for name in (found.group(1), f"{found.group(1)}s") if (library / f"journal-{name}" / "SKILL.md").is_file()), "") if found else ""
        if not skill:
            return ""
        row = context.agent.row
        since = trigger.last(context.record, row.title, context.feature.name).since
        at = loaded_at(row).get(skill, 0.0)
        if not at or at < since:
            require(context.record, row.title, {skill: since})
        return ""


class RequireKeywordSkill(ToolInterceptor):
    behaviour = "keywords"

    def intercept(self, context: AgentContext, call) -> str:
        require_named(context.record, context.agent.row, call.text)
        return ""


def require_named(record, row, text: str) -> None:
    loaded = loaded_at(row)
    named = {name: time.time() for name, words in keywords(record).items() if not loaded.get(name) and mentioned(words, text)}
    if named:
        require(record, row.title, named)


class RefuseUntilLoaded(ToolInterceptor):
    limit = "most_refusals"
    steps_aside = "steps_aside"

    def intercept(self, context: AgentContext, call) -> str:
        missing = outstanding(context.record, context.agent.row)
        if not missing:
            return ""
        title, brief = context.feature.line("required", {"skills": ", ".join(missing), "loads": ", ".join(context.provider.skill_load(name) for name in missing)})
        return f"{title} - {brief}"
