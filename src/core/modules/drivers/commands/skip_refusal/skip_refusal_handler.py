from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.command.request_user_approval import RequestUserApproval
from engine.command.errors.user_approval_refusal import UserApprovalRefusal
from engine.guard.guard import Guard
from engine.query.conditions.greater import Greater
from engine.query.conditions.has_value import HasValue
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.log.refusal_log import RefusalLog
from engine.registry.registry import Registry
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.drivers.commands.skip_refusal.skip_refusal import SkipRefusal
from engine.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.models.refusal_skip import RefusalSkip
from core.modules.drivers.support.access_nudges import SKIPS_SPENT
from engine.driver.nudger import Nudger

MOST_SKIP_COUNT = 5
SKIP_SOURCE = "drivers.refusal-skip"


class SkipRefusalHandler(Handler[SkipRefusal, RefusalSkip]):
    """Keeps an agent's skip of a refusal that just met it, with its reason. A safety refusal has no skip. A
    skip counts as one more in a row unless the agent obeyed a refusal since its last, meaning something
    other than the skipped refusal refused it (a retry is no obeying). At five, the skip is gone; its main
    agent or the person is told, and only a restore gives it back. A new skip is held until the agent
    confirms it; a --skip-guard flag only spends a skip already confirmed."""

    command = SkipRefusal

    def __init__(self, queries: Queries, repository: Repository, refusals: RefusalLog, registry: Registry, nudger: Nudger, bus: Bus, numbers: RowNumbers) -> None:
        self.numbers = numbers
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
        if command.is_used:
            return self.confirmed_skip_used(actor, command.name, context)
        last = self.queries.query(RefusalSkip).filter(session_agent_id=actor.id).newest().first()
        if last is not None and last.streak >= MOST_SKIP_COUNT and last.restored_at is None:
            agent = self.queries.query(Agent).find(actor.id)
            if agent.role == AgentRole.MAIN or agent.parent_id is None:
                raise self.restoration_approval(agent)
            raise Refusal(f"you skipped {MOST_SKIP_COUNT} refusals in a row and lost the skip", "obey the refusal until the skip is restored")
        skipped_at = last.created_at.text if last is not None and last.created_at is not None else ""
        self.check_refused(actor, command.name, skipped_at)
        skip = self.repository.save(RefusalSkip(session_agent_id=actor.id, creator_id=actor.id, name=command.name, reason=command.reason.strip(), streak=self.skip_count(actor, last, command.name, skipped_at)), context)
        if skip.streak == MOST_SKIP_COUNT:
            self.raised(actor.id, context)
        return skip

    def confirmed_skip_used(self, actor: Actor, name: str, context: Context) -> RefusalSkip:
        skip = self.queries.query(RefusalSkip).filter(session_agent_id=actor.id, name=name, used_at=None, cancelled_at=None, needs_approval=False).matching(HasValue("confirmed_at")).newest().first()
        if skip is None:
            raise Refusal(f"{name} has no confirmed skip of yours: a skip is held until you confirm it with what you tried",
                          f"journal refusal skip {name} --reason '<why it is wrong here>', then confirm it")
        return self.repository.update(skip, context, used_at=context.timestamp)

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
            approval = self.restoration_approval(agent)
            self.bus.dispatch(RequestUserApproval(approval, approval.arguments, agent_id), context)
            return
        self.nudger.send(agent.parent_id, SKIPS_SPENT, SKIP_SOURCE, context, agent=self.numbers.number(AGENT_MODEL_NAME, agent_id), count=MOST_SKIP_COUNT)

    @staticmethod
    def restoration_approval(agent: Agent) -> UserApprovalRefusal:
        return UserApprovalRefusal(f"{AgentLabel.from_agent(agent).text.capitalize()} skipped {MOST_SKIP_COUNT} refusals in a row and lost the skip. Restore its skip?",
                            ("refusal", "restore", str(agent.number)), why=f"It went on past {MOST_SKIP_COUNT} refusals in a row by skipping them, so the journal took the skip from it.")
