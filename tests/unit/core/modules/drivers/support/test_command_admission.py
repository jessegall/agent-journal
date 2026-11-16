from dataclasses import dataclass
from types import SimpleNamespace

import pytest

from engine.actor.actor import Actor
from engine.agent_machine.stepping.grant import NEXT_ACTION, Grant
from engine.agent_machine.contracts.policy import Policy
from engine.agent_stack.reason import Reason
from engine.command.command import Command
from engine.enums.actor_type import ActorType
from engine.enums.decision_class import DecisionClass
from engine.enums.grant_state import GrantState
from engine.enums.grant_type import GrantType
from engine.errors.refusal import Refusal
from core.modules.drivers.support.command_check import CommandCheck
from core.modules.drivers.support.machine_assembly import MachineAssembly

AGENT = SimpleNamespace(id=4, parent_id=None, environment_id=1, role="main")


@dataclass(frozen=True)
class SendWork(Command[None]):
    """A sample command a policy guards at its entry point."""


class SendWorkPolicy(Policy):
    key = "samples.send-work"
    rank = "samples.policies"
    grant_types = [GrantType.REFUSAL_SKIP]
    entry_point_commands = [SendWork]

    def refusals(self, question, view):
        return []

    def entry_point_refusals(self, command, agent):
        return [Reason(self.key, DecisionClass.REFUSE, self.rank, "no work is sent here")]


class Rows:
    def __init__(self, receipt=None):
        self.receipt, self.saved = receipt, []

    def query(self, model):
        return SimpleNamespace(filter=lambda **fields: SimpleNamespace(first=lambda: self.receipt))

    def save_change(self, stored, changed, context):
        self.saved.append(changed)


class Grants:
    def __init__(self, grants=()):
        self.grants, self.spent = list(grants), []

    def usable_grants(self, agents):
        return {AGENT.id: self.grants}

    def spend(self, grant, event_id, fingerprint, context):
        self.spent.append(grant)


def start_check(rows: Rows, grants: Grants) -> CommandCheck:
    finder = SimpleNamespace(modules=lambda: [SimpleNamespace(policies=[SendWorkPolicy])])
    types = SimpleNamespace(behaviours=lambda role: None, read_access_keys=lambda: ())
    return CommandCheck(finder, SimpleNamespace(get=lambda cls: cls()), SimpleNamespace(find=lambda agent_id: AGENT), grants, rows, rows,
                            MachineAssembly(finder, SimpleNamespace(), types))


CONTEXT = SimpleNamespace(actor=Actor(AGENT.id, ActorType.AGENT), command=SendWork(), timestamp="now")
SKIP = Grant(7, GrantType.REFUSAL_SKIP, SendWorkPolicy.key, AGENT.id, 1, "", NEXT_ACTION, GrantState.CONFIRMED, AGENT.id, None, "the work is the task")


def test_an_entry_point_with_no_receipt_or_grant_is_refused_in_the_policys_own_words():
    with pytest.raises(Refusal, match="no work is sent here"):
        start_check(Rows(), Grants()).admit(SendWork, CONTEXT)


def test_the_hooks_receipt_passes_the_entry_point_once_and_is_taken():
    rows = Rows(receipt=SimpleNamespace(changed=lambda **fields: fields))
    start_check(rows, Grants()).admit(SendWork, CONTEXT)
    assert rows.saved == [{"consumed_at": "now"}]


def test_a_usable_grant_passes_the_entry_point_and_is_spent_there():
    grants = Grants([SKIP])
    start_check(Rows(), grants).admit(SendWork, CONTEXT)
    assert grants.spent == [SKIP]
