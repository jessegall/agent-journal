from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome


@dataclass(frozen=True)
class WakeMerger(Command[None]):
    """A worker's tests passed: the merger takes it, or the main agent when no merger can start."""

    worker_id: int


@dataclass(frozen=True)
class TellMainAgent(Command[None]):
    """Sends the main agent a line of the merger."""

    text: str


@dataclass(frozen=True)
class ReadNextMerge(Command[str]):
    """The merger reads the next worker waiting, with its tasks, proofs and log lines."""


@dataclass(frozen=True)
class MergeNextWorker(Command[MergeOutcome]):
    """The merger takes a worker's work into the branch and tells the main agent."""

    worker_id: int


@dataclass(frozen=True)
class PassWorkerToMain(Command[None]):
    """The merger leaves a worker to the main agent, with the reason."""

    worker_id: int
    reason: str


@dataclass(frozen=True)
class SendMergeFindings(Command[None]):
    """The merger sends the judge's findings on a merge back to the worker that wrote the work."""

    worker_id: int
    findings: str
