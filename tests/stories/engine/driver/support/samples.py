from dataclasses import dataclass
from enum import StrEnum

from engine.enums.agent_role import AgentRole
from engine.enums.actor_type import ActorType
from engine.command.command import Command
from engine.command.context import Context
from engine.command.handler import Handler
from engine.command.move_command import MoveCommand
from engine.database.migration import Migration
from engine.enums.command_category import CommandCategory
from engine.enums.command_effect import CommandEffect
from engine.agent_machine.driver import Driver
from core.modules.drivers.drivers.main.main_agent_driver import MainAgentDriver
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop
from engine.module.suite import Suite
from engine.guard.guard import Guard
from engine.model.lifecycle import Lifecycle
from engine.model.model import Model
from engine.model.move import Move
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from engine.errors.refusal import Refusal
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.event.created import Created

TEST_ROWS_REASON = "the test reads every row it checks"

SAMPLES = "tests.stories.engine.driver.support.samples:SamplesModule"
LEAD = "samples.lead"


REMOVAL = HookSamples.shell("rm -rf build", ShellPart("rm", CommandCategory.EDIT, ["-rf", "build"], effects=[CommandEffect.WRITES_FILES]))


class EditLockState(StrEnum):
    OPEN = "open"
    ENDED = "ended"


class EditLockLifecycle(Lifecycle):
    states = EditLockState
    initial = [EditLockState.OPEN]
    editable = [EditLockState.OPEN]
    deletable = [EditLockState.OPEN, EditLockState.ENDED]

    ended = Move("ended", [EditLockState.OPEN], EditLockState.ENDED)
    reopen = Move("reopen", [EditLockState.ENDED], EditLockState.OPEN)


@dataclass(frozen=True, kw_only=True)
class EditLock(Model):
    """A sample row that refuses an agent's edits while it is open."""

    model_name = "edit_lock"
    cli_name = "edit-lock"
    lifecycle = EditLockLifecycle

    agent_id: int
    state: EditLockState = EditLockState.OPEN


@dataclass(frozen=True)
class EditLockEnd(MoveCommand[EditLock]):
    move = EditLockLifecycle.ended


@dataclass(frozen=True)
class EditLockReopen(MoveCommand[EditLock]):
    move = EditLockLifecycle.reopen


class EditLocksTable(Migration):
    number = 1
    statements = (
        "CREATE TABLE edit_locks (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, state TEXT NOT NULL DEFAULT 'open',"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX edit_locks_agent_state ON edit_locks (agent_id, state)",
    )


@dataclass(frozen=True)
class SampleNumber(Command[int]):
    """A sample command whose result is 7."""


class SampleNumberHandler(Handler[SampleNumber, int]):
    command = SampleNumber

    def handle(self, command: SampleNumber, context: Context) -> int:
        return 7


class LeadLockGuard(Guard[Created[EditLock]]):
    """An agent makes no edit lock; a user may."""

    name = "samples.lead-lock-guard"

    def check(self, event: Created[EditLock], context: Context) -> None:
        if context.actor.type is not ActorType.AGENT:
            return None
        raise Refusal("the lead makes no edit lock itself", "a user makes one with journal edit-lock make <agent>")


class SampleSuite(Suite):
    """A sample suite of one lead."""

    name = "samples"


class Lead(Driver):
    """Drives the sample suite's main agent."""

    name = LEAD
    suite = SampleSuite.name
    agent_type = AgentRole.MAIN
    gathers = [MainAgentDriver]
    rank_order = MainAgentDriver.rank_order
    work_stop = WorkStop.REFUSE_DURING_WORK
    responder = Responder.PERSON
    instructions = ["You are the sample lead"]


class ControlSuite(Suite):
    """A second sample suite of one lead."""

    name = "control"


class ControlLead(Driver):
    """Drives the control suite's main agent."""

    name = "control.lead"
    suite = ControlSuite.name
    agent_type = AgentRole.MAIN
    gathers = [MainAgentDriver]
    rank_order = MainAgentDriver.rank_order
    work_stop = WorkStop.REFUSE_DURING_WORK
    responder = Responder.PERSON
    instructions = ["You are the control lead"]


class SamplesModule(Module):
    name = "samples"
    requires_engine = ">=7.0,<8"
    dependencies = ["journal.core.agents", "journal.core.drivers"]
    models = [ModelDeclaration(EditLock, commands=[EditLockEnd, EditLockReopen])]
    migrations = [EditLocksTable]
    guards = [LeadLockGuard]
    handlers = [SampleNumberHandler]
    agent_drivers = [Lead, ControlLead]


class SampleSuiteOfSamplesModule(SampleSuite):
    modules = [SamplesModule]


class ControlSuiteOfSamplesModule(ControlSuite):
    modules = [SamplesModule]
