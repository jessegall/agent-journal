import time

from dataclasses import dataclass
from typing import ClassVar

from engine.events import AgentReported, ResourceEvent, SessionStarted, ToolFinished
from features import trigger
from features.parts import AgentContext, Context, Handler
from features.skill_loading.catalogue import SKILL, chosen, skills
from features.skill_loading.interceptors import require_named
from features.skill_loading.required import require
from providers import PROVIDERS
from resources.base import SYSTEM, USER
from resources.types import AgentRow

WINDOWS = ("SessionStart", "PreCompact")
KEPT_LOADS = 50


def journal_skill(name: str) -> bool:
    return name == "journal" or name.startswith("journal-")


class RemindUnloaded(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
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

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        row = context.agent.row
        since = float(trigger.last(context.record, row.title, context.feature.name).get("since") or 0)
        provider = PROVIDERS.get(row.provider)
        if not since or not provider or not row.transcript:
            return
        require(context.record, row.title, {"journal": since})


class NameStaleSkills(Handler):
    behaviour = "stale"

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        always = set(chosen(context.record))
        changed = {s[SKILL.name]: s[SKILL.changed] for s in skills(context.record, context.agent.row.n) if s[SKILL.stale]}
        held = {name: at for name, at in changed.items() if name in always}
        if held:
            require(context.record, context.agent.session, held)
        rest = sorted(set(changed) - always)
        if rest and context.once("stale", ", ".join(rest)):
            context.agent.whisper("stale", skills=", ".join(rest))


class RequireAlwaysSkills(Handler):
    behaviour = "always"

    def handle(self, context: AgentContext, event: SessionStarted) -> None:
        now = time.time()
        require(context.record, context.agent.session, {name: now for name in chosen(context.record)})


@dataclass(frozen=True)
class MessageArrived(ResourceEvent):
    on: ClassVar[str] = "message.created"


class RequireSkillsTheUserNames(Handler):
    behaviour = "keywords"

    def handle(self, context: Context, event: MessageArrived) -> None:
        if event.actor != USER:
            return
        row = context.journal.acting(SYSTEM).agents.primary()
        if row:
            require_named(context.record, row, context.journal.messages.load(event.n).brief)


class ShowLoadsInChat(Handler):
    behaviour = "chat"

    def handle(self, context: AgentContext, event: ToolFinished) -> None:
        if event.skill:
            loads = [*(context.agent.row.data.get(AgentRow.skill_loads) or []), {"skill": event.skill, "at": time.time()}]
            context.journal.agents.update(context.agent.row.n, **{AgentRow.skill_loads: loads[-KEPT_LOADS:]})
