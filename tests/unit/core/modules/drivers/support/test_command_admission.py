from dataclasses import dataclass
from types import SimpleNamespace

import pytest

from engine.actor.actor import Actor
from engine.agent_machine.contracts.grant import NEXT_ACTION, Grant
from engine.agent_machine.contracts.policy import Policy
from engine.agent_stack.reason import Reason
from engine.command.command import Command
from engine.enums.actor_type import ActorType
from engine.enums.decision_class import DecisionClass
from engine.enums.grant_state import GrantState
from engine.enums.grant_type import GrantType
from engine.errors.refusal import Refusal
from core.modules.drivers.support.command_admission import CommandAdmission

AGENT = SimpleNamespace(id=4, parent_id=None, environment_id=1, role="main")


@dataclass(frozen=True)
class SendWork(Command[None]):
    """A sample command a policy guards at its entrance."""


class SendWorkPolicy(Policy):
    key = "samples.send-work"
    rank = "samples.policies"
    grant_types = [GrantType.REFUSAL_SKIP]
    entrance_commands = [SendWork]

    def refusals(self, question, view):
        return []

    def entrance_refusals(self, command, agent):
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

    def spend(self, grant, firing, fingerprint, context):
        self.spent.append(grant)


def admission(rows: Rows, grants: Grants) -> CommandAdmission:
    finder = SimpleNamespace(modules=lambda: [SimpleNamespace(policies=[SendWorkPolicy])])
    return CommandAdmission(finder, SimpleNamespace(get=lambda cls: cls()), SimpleNamespace(), SimpleNamespace(find=lambda agent_id: AGENT), grants, rows, rows)


CONTEXT = SimpleNamespace(actor=Actor(AGENT.id, ActorType.AGENT), command=SendWork(), timestamp="now")
SKIP = Grant(7, GrantType.REFUSAL_SKIP, SendWorkPolicy.key, AGENT.id, 1, "", NEXT_ACTION, GrantState.CONFIRMED, AGENT.id, None, "the work is the task")


def test_an_entrance_with_no_receipt_or_grant_is_refused_in_the_policys_own_words():
    with pytest.raises(Refusal, match="no work is sent here"):
        admission(Rows(), Grants()).admit(SendWork, CONTEXT)


def test_the_hooks_receipt_passes_the_entrance_once_and_is_taken():
    rows = Rows(receipt=SimpleNamespace(changed=lambda **fields: fields))
    admission(rows, Grants()).admit(SendWork, CONTEXT)
    assert rows.saved == [{"consumed_at": "now"}]


def test_a_usable_grant_passes_the_entrance_and_is_spent_there():
    grants = Grants([SKIP])
    admission(Rows(), grants).admit(SendWork, CONTEXT)
    assert grants.spent == [SKIP]
