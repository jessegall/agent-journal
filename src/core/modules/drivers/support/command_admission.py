from engine.agent_machine.contracts.grant import NEXT_ACTION
from engine.agent_machine.contracts.grant_ledger import GrantLedger
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.command.command import Command
from engine.command.context import Context
from engine.container.container import Container
from engine.errors.refusal import Refusal
from engine.module.module_finder import ModuleFinder
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.admission_receipt import AdmissionReceipt
from core.modules.drivers.support.answering_slices import AnsweringSlices
from core.modules.drivers.support.contribution_slices import ADMISSION_SLICE


class CommandAdmission:
    """Asks a command's entrance the policies the hook asks (doc 1310 sections 4.7 and 10.9), once the
    admission slice answers the agent that runs it: a refusal is passed by the receipt the hook left when it
    spent a grant for this command, taken once, or else by a usable grant spent here; otherwise the command
    is refused with the policy's own text, the hook's text."""

    def __init__(self, finder: ModuleFinder, container: Container, slices: AnsweringSlices, agents: AgentRows, grant_store: GrantLedger,
                 queries: Queries, repository: Repository) -> None:
        self.finder, self.container, self.slices, self.agents, self.grant_store = finder, container, slices, agents, grant_store
        self.queries, self.repository = queries, repository

    def answers(self, context: Context) -> bool:
        return context.actor.is_agent() and ADMISSION_SLICE in self.slices.tick_answering_slices(self.agents.find(context.actor.id))

    # a guard runs on a row's save, where the context's command may be one its entrance command dispatched, so the
    # guard names the entrance command it guards
    def admit(self, entrance: type[Command[object]], context: Context) -> None:
        agent = self.agents.find(context.actor.id)
        reference = AgentReference(agent.id, agent.parent_id, agent.environment_id, agent.role)
        for policy in self.entrance_policies(entrance, agent):
            refusals = policy.entrance_refusals(context.command, reference)
            if refusals and not self.is_passed(policy, reference, context):
                raise Refusal(refusals[0].text)

    def entrance_policies(self, entrance: type[Command[object]], agent: Agent) -> list[Policy]:
        listed = [policy for module in self.finder.modules() for policy in module.policies if entrance in policy.entrance_commands]
        return [self.container.get(policy) for policy in listed if not policy.agent_types or agent.role in policy.agent_types]

    def is_passed(self, policy: Policy, agent: AgentReference, context: Context) -> bool:
        receipt = self.queries.query(AdmissionReceipt).filter(session_agent_id=agent.agent_id, policy_key=policy.key, consumed_at=None).first()
        if receipt is not None:
            self.repository.save_change(receipt, receipt.changed(consumed_at=context.timestamp), context)
            return True
        if policy.is_safety:
            return False
        grant = next((grant for grant in self.grant_store.usable_grants([agent]).get(agent.agent_id, ())
                      if grant.grant_type in policy.grant_types and grant.passes(policy.key, NEXT_ACTION)), None)
        if grant is None:
            return False
        self.grant_store.spend(grant, "", "", context)
        return True
