import time
from pathlib import Path

from engine.events import AgentUpdated
from features import trigger
from features.parts import Context, Handler
from features.skills.catalogue import SKILL, skills
from providers import PROVIDERS
from resources.types import AgentRow

WINDOWS = ("SessionStart", "PreCompact")


def journal_skill(name: str) -> bool:
    return name == "journal" or name.startswith("journal-")


class RemindUnloaded(Handler):
    def handle(self, context: Context, event: AgentUpdated) -> None:
        if not context.agent:
            return
        row, name = context.agent.row, context.feature.name
        state = trigger.last(context.record, row.title, name)
        if row.event in WINDOWS and state.get(AgentRow.event) != row.event:
            trigger.write(context.record, row, name, told=False, uses=row.uses or 0, context=row.context or 0, since=time.time())
            state = trigger.last(context.record, row.title, name)
        if "told" not in state and state.get(AgentRow.at):
            trigger.write(context.record, row, name, told=True)
            state = trigger.last(context.record, row.title, name)
        if state.get("told") or not context.due() or any(journal_skill(s) for s in row.skills):
            return
        context.agent.whisper("unloaded")
        trigger.write(context.record, row, name, told=True)


class HoldUntilReloaded(Handler):
    behaviour = "reload"

    def handle(self, context: Context, event: AgentUpdated) -> None:
        row = context.agent.row if context.agent else None
        since = float(trigger.last(context.record, row.title, context.feature.name).get("since") or 0) if row else 0
        provider = PROVIDERS.get(row.provider) if row else None
        if not since or not provider or not row.transcript:
            return
        loaded = provider().loaded_skills(Path(row.transcript))
        if any(name == "journal" and float(at or 0) >= since for name, at in loaded.items()):
            context.release("reload")
        else:
            context.hold("reload held", "reload")


class NameStaleSkills(Handler):
    behaviour = "stale"

    def handle(self, context: Context, event: AgentUpdated) -> None:
        changed = [s[SKILL.name] for s in skills(context.record, context.agent.row.n) if s[SKILL.stale]]
        if changed:
            context.agent.whisper("stale", count=context.feature.plural(len(changed), "skill"), them="it" if len(changed) == 1 else "them",
                                  skills=", ".join(f"Skill: {name}" for name in changed))
