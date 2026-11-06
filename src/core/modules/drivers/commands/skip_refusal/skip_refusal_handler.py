from dataclasses import replace

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.guard.guard import Guard
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.refusal_log import RefusalLog
from core.base.registry.registry import Registry
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.skip_refusal.skip_refusal import SkipRefusal
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.models.refusal_skip import RefusalSkip
from core.modules.drivers.support.access_nudges import SKIPS_SPENT
from core.modules.drivers.support.nudger import Nudger
from core.modules.messages.commands.send_message.send_message import SendMessage

MOST_SKIP_COUNT = 5
SKIP_SOURCE = "drivers.refusal-skip"


class SkipRefusalHandler(Handler[SkipRefusal, RefusalSkip]):
    """Keeps an agent's skip of a refusal that just met it, with its reason. A safety refusal has no skip.
    A skip counts as one more in a row unless the agent obeyed a refusal since its last, meaning something
    other than the skipped refusal refused it (a retry is no obeying). At five, the skip is gone; its main
    agent or the person is told, and only a restore gives it back."""

    command = SkipRefusal

    def __init__(self, queries: Queries, repository: Repository, refusals: RefusalLog, registry: Registry, nudger: Nudger, bus: Bus) -> None:
        self.queries, self.repository, self.refusals, self.registry = queries, repository, refusals, registry
        self.nudger, self.bus = nudger, bus

    def handle(self, command: SkipRefusal, context: Context) -> RefusalSkip:
        actor = context.actor
        if actor.type is not ActorType.AGENT:
            raise Refusal("only an agent skips a refusal this way", "a person passes a guard with --skip-guard")
        guard = next((entry for entry in self.registry.guards if entry.name == command.name), None)
        if guard is not None and guard.path.checked_class(Guard).is_safety:
            raise Refusal(f"{command.name} is a safety refusal and has no skip", "say in your report what you need")
        if not command.reason.strip():
            raise Refusal("say why this refusal does not apply", "--skip-reason '<why>'" if command.is_used else "--reason '<why>'")
        last = self.queries.query(RefusalSkip).filter(session_agent_id=actor.id).newest().first()
        if last is not None and last.streak >= MOST_SKIP_COUNT and last.restored_at is None:
            raise Refusal(f"you skipped {MOST_SKIP_COUNT} refusals in a row and lost the skip", "obey the refusal; a skip comes back with journal refusal restore")
        skipped_at = last.created_at.text if last is not None and last.created_at is not None else ""
        self.check_refused(actor, command.name, skipped_at)
        skip = self.repository.save(RefusalSkip(session_agent_id=actor.id, creator_id=actor.id, name=command.name, reason=command.reason.strip(), streak=self.skip_count(actor, last, command.name, skipped_at),
                                                used_at=context.timestamp if command.is_used else None), context)
        if skip.streak == MOST_SKIP_COUNT:
            self.raised(actor.id, context)
        return skip

    def check_refused(self, actor: Actor, name: str, skipped_at: str) -> None:
        if self.refusals.guard_refused_past(actor.id, name.partition(":")[0], skipped_at):
            return
        call = self.queries.query(HookCall).filter(session_agent_id=actor.id, answer=HookAnswer.REFUSED).newest().first()
        rules = call.refused_rules if call is not None and call.creation_timestamp().text > skipped_at else ()
        refused = next((rule for rule in rules if rule.get("rule") == name), None)
        if refused is None:
            raise Refusal(f"{name} has not refused you since your last skip", "a skip follows a refusal; carry on without one")
        if refused.get("safety"):
            raise Refusal(f"{name} is a safety refusal and has no skip", "say in your report what you need")

    def skip_count(self, actor: Actor, last: RefusalSkip | None, name: str, skipped_at: str) -> int:
        if last is None or last.restored_at is not None:
            return 1
        return 1 if self.refused_names_past(actor, skipped_at) - {name} else last.streak + 1

    def refused_names_past(self, actor: Actor, skipped_at: str) -> set[str]:
        calls = self.queries.query(HookCall).filter(session_agent_id=actor.id, answer=HookAnswer.REFUSED).matching(Greater("created_at", skipped_at)).all_rows()
        hook_names = {name for call in calls for name in self.refusing_rules(call)}
        return hook_names | self.refusals.guards_refused_past(actor.id, skipped_at)

    @staticmethod
    def refusing_rules(call: HookCall) -> list[str]:
        return [str(row.get("rule", "")) for row in call.refused_rules] or [""]

    def raised(self, agent_id: int, context: Context) -> None:
        agent = self.queries.query(Agent).find(agent_id)
        if agent.role == AgentRole.MAIN or agent.parent_id is None:
            self.bus.dispatch(SendMessage(SKIPS_SPENT.nudge(agent=agent_id, count=MOST_SKIP_COUNT).text), replace(context, actor=Actor.core()))
            return
        self.nudger.send(agent.parent_id, SKIPS_SPENT, SKIP_SOURCE, context, agent=agent_id, count=MOST_SKIP_COUNT)
