from collections.abc import Sequence
from dataclasses import dataclass
from enum import StrEnum

from core.base.change.change import Change
from core.base.command.move_command import MoveCommand
from core.base.database.migration import Migration
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver import Driver
from core.base.driver.driver_rule import DriverRule
from core.base.driver.open_row import OpenRow
from core.base.driver.overlay import Overlay
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.suite import Suite
from core.base.guard.guard import Guard
from core.base.model.lifecycle import Lifecycle
from core.base.model.model import Model
from core.base.model.move import Move
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.settings.setting_values import SettingValues

SAMPLES = "tests.stories.core.base.driver.support.samples:SamplesModule"
LEAD = "samples.lead"


class EditLockState(StrEnum):
    OPEN = "open"
    ENDED = "ended"


class EditLockLifecycle(Lifecycle):
    states = EditLockState
    initial = [EditLockState.OPEN]
    editable = [EditLockState.OPEN]
    deletable = [EditLockState.OPEN, EditLockState.ENDED]

    ended = Move("ended", [EditLockState.OPEN], EditLockState.ENDED)
    reopening = Move("reopening", [EditLockState.ENDED], EditLockState.OPEN)


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
class EditLockReopening(MoveCommand[EditLock]):
    move = EditLockLifecycle.reopening


class EditLocksTable(Migration):
    number = 1
    statements = (
        "CREATE TABLE edit_locks (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, state TEXT NOT NULL DEFAULT 'open',"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )


class StopLine(DriverRule):
    """The lead is told one line at every stop."""

    name = "samples.stop-line"
    hook = "stop"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_lines("the lead stops here")


class RemovalLimit(DriverRule):
    """The lead removes no folder with rm -rf."""

    name = "samples.removal-limit"
    hook = "pre_tool_use"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is not None and shell.line.startswith("rm -rf"):
            return RuleAnswer.refused("the lead removes no folder")
        return RuleAnswer.allowed()


class LockedEditRefusal(DriverRule):
    """An open edit lock refuses every edit."""

    name = "samples.locked-edit-refusal"
    hook = "pre_tool_use"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if hook.event.tool is not None and hook.event.tool.category == "edit":
            return RuleAnswer.refused(f"{hook.layer_ref} refuses every edit")
        return RuleAnswer.allowed()


class ReturnLine(DriverRule):
    """Once an edit lock above it ends, the lead is told it is back at its own work, once."""

    name = "samples.return-line"
    hook = "*"
    drivers = ["samples.*"]
    history = True

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_lines("you are back at your own work") if hook.regained_control else RuleAnswer.allowed()


class FailingRule(DriverRule):
    """Fails on every stop."""

    name = "samples.failing-rule"
    hook = "stop"
    drivers = ["samples.*"]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        raise RuntimeError("the sample rule failed")


class EssentialClaim(DriverRule):
    """A rule its module marks essential, ordinary until the user allows it."""

    name = "samples.essential-claim"
    hook = "stop"
    drivers = ["*"]
    essential = True

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_lines("the sample rule speaks first")


class LockRelease(DriverRule):
    """A prompt ends the edit lock it is asked for."""

    name = "samples.lock-release"
    hook = "prompt"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().ending_layer(EditLockEnd(hook.layer.row_id)) if hook.layer is not None else RuleAnswer.allowed()


class SecondLockRelease(DriverRule):
    """A second rule that also ends the edit lock on a prompt, so one row gets two moves on one hook."""

    name = "samples.second-lock-release"
    hook = "prompt"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(EditLockEnd(hook.layer.row_id)) if hook.layer is not None else RuleAnswer.allowed()


class StopRefusal(DriverRule):
    """While the project setting samples.refuse-stops is true, the lead's stop is refused."""

    name = "samples.stop-refusal"
    hook = "stop"

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.refused("the sample lead may not stop yet") if self.settings.project_value("samples.refuse-stops", False) is True else RuleAnswer.allowed()


class ReopeningClaim(DriverRule):
    """On a compaction, asks to reopen the edit lock it is asked for, which is open, so the lifecycle refuses it."""

    name = "samples.reopening-claim"
    hook = "compact"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(EditLockReopening(hook.layer.row_id)) if hook.layer is not None else RuleAnswer.allowed()


class EditLockOverlay(Overlay):
    """An open edit lock of the agent, which silences the lead's own rules."""

    name = "samples.edit-lock"
    exclusive = True
    delays_lines = True
    rules = [LockedEditRefusal, LockRelease, SecondLockRelease, ReopeningClaim]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def open_rows(self, agent_id: int) -> Sequence[OpenRow]:
        return [OpenRow("edit_lock", lock.id, lock.updated_at) for lock in self.queries.query(EditLock).filter(agent_id=agent_id, state=EditLockState.OPEN).all_rows()]


class LeadLockGuard(Guard):
    """An agent the lead drives makes no edit lock; a person and other agents may."""

    name = "samples.lead-lock-guard"
    event = "edit_lock.create"

    def check(self, change: Change[Model]) -> None:
        raise Refusal("the lead makes no edit lock itself", "a person makes one with journal edit-lock make <agent>")


class SampleSuite(Suite):
    """A sample suite of one lead."""

    name = "samples"
    defaults = {"main": LEAD}


class Lead(Driver):
    """Drives the sample suite's main agent."""

    name = LEAD
    suite = "samples"
    role = "main"
    limits = [RemovalLimit]
    rules = [StopLine, StopRefusal]
    guards = [LeadLockGuard]
    opening_lines = ["You are the sample lead"]


class ControlSuite(Suite):
    """A sample suite in complete control that includes the sample edit lock."""

    name = "control"
    defaults = {"main": "control.lead"}
    complete_control = True
    included_overlays = ["samples.edit-lock"]


class ControlLead(Driver):
    """Drives the control suite's main agent, with no rules of its own."""

    name = "control.lead"
    suite = "control"
    role = "main"
    opening_lines = ["You are the control lead"]


class SamplesModule(Module):
    name = "samples"
    requires_core = ">=5.0,<6"
    dependencies = ["journal.core.agents", "journal.core.drivers"]
    models = [ModelDeclaration(EditLock, commands=[EditLockEnd, EditLockReopening])]
    migrations = [EditLocksTable]
    guards = [LeadLockGuard]
    suites = [SampleSuite, ControlSuite]
    drivers = [Lead, ControlLead]
    overlays = [EditLockOverlay]
    driver_rules = [ReturnLine, FailingRule, EssentialClaim]
