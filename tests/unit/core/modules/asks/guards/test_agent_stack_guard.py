from dataclasses import replace

import pytest

from engine.actor.actor import Actor
from engine.command.context import Context
from engine.command.errors.user_approval_refusal import UserApprovalRefusal
from engine.enums.actor_type import ActorType
from engine.event.created import Created
from engine.event.updated import Updated
from engine.time.timestamp import Timestamp
from core.modules.asks.guards.agent_stack_guard import AgentStackGuard
from core.modules.asks.models.ask_stack import AskStack

NOW = Timestamp.parsed("2026-11-14T06:00:00+00:00")
WAITING = AskStack(id=4, version=1, creator_id=7, topic="general", levels_json='[{"profile": "overseer"}]', needs_approval=True)


def context(actor_type: ActorType) -> Context:
    return Context(Actor(7, actor_type), NOW, None)


def test_agent_change_needs_approval():
    with pytest.raises(UserApprovalRefusal):
        AgentStackGuard().check(Created(replace(WAITING, needs_approval=False)), context(ActorType.AGENT))


def test_agent_waiting_change_is_saved():
    AgentStackGuard().check(Created(WAITING), context(ActorType.AGENT))


def test_user_change_takes_effect():
    AgentStackGuard().check(Created(replace(WAITING, needs_approval=False)), context(ActorType.USER))


def test_agent_cannot_approve_its_own_waiting_stack():
    with pytest.raises(UserApprovalRefusal):
        AgentStackGuard().check(Updated(replace(WAITING, needs_approval=False), WAITING), context(ActorType.AGENT))


def test_agent_clear_waits_for_user():
    cleared = replace(WAITING, levels_json="[]")
    AgentStackGuard().check(Created(cleared), context(ActorType.AGENT))
    with pytest.raises(UserApprovalRefusal):
        AgentStackGuard().check(Created(replace(cleared, needs_approval=False)), context(ActorType.AGENT))
