import time

from engine.events import AgentUpdated
from features import trigger
from features.parts import Context, Handler
from features.skill_loading.catalogue import SKILL, skills
from features.skill_loading.required import require
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
            trigger.write(context.record, row, name, notified=False, uses=row.uses or 0, context=row.context or 0, since=time.time())
            state = trigger.last(context.record, row.title, name)
        if "notified" not in state and state.get(AgentRow.at):
            trigger.write(context.record, row, name, notified=True)
            state = trigger.last(context.record, row.title, name)
        if state.get("notified") or not context.due() or any(journal_skill(s) for s in row.skills):
            return
        context.agent.whisper("unloaded")
        trigger.write(context.record, row, name, notified=True)


class HoldUntilReloaded(Handler):
    behaviour = "reload"

    def handle(self, context: Context, event: AgentUpdated) -> None:
        row = context.agent.row if context.agent else None
        since = float(trigger.last(context.record, row.title, context.feature.name).get("since") or 0) if row else 0
        provider = PROVIDERS.get(row.provider) if row else None
        if not since or not provider or not row.transcript:
            return
        require(context.record, row.title, {"journal": since})


class NameStaleSkills(Handler):
    behaviour = "stale"

    def handle(self, context: Context, event: AgentUpdated) -> None:
        changed = {s[SKILL.name]: s[SKILL.changed] for s in skills(context.record, context.agent.row.n) if s[SKILL.stale]}
        if changed:
            require(context.record, context.agent.session, changed)
