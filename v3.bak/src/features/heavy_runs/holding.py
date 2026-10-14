"""Rule 4 enforced from the queue rather than from an orchestrator's memory: one heavy run at a time."""

from controllers.types import Agents, Environments
from features.heavy_runs.queue import HeavyRuns
from engine.journal_calls import runs_tests
from resources.base import SYSTEM

STATE_FILE = "heavy-runs.json"


def heavy_now(record) -> list[tuple[str, str]]:
    """Every heavy run going in the project now, as the environment it runs in and the command it runs, read from the agent rows rather than from anything anyone remembers."""
    return [(place.title, entry.get("command", ""))
            for place in Environments(record, actor=SYSTEM).rows.standing()
            for row in Agents(record, actor=SYSTEM).in_env(place.title).rows.standing()
            for entry in row.runs
            if entry.get("running") and runs_tests(entry.get("command", ""))]


def ahead_of(record, shell: str) -> list[tuple[str, str]]:
    """The heavy runs going in other environments when this command is one, else none."""
    return [(where, command) for where, command in heavy_now(record) if where != record.env] if shell and runs_tests(shell) else []


def queue_of(journal_root, forgotten_after) -> HeavyRuns:
    return HeavyRuns(journal_root.shared_state(STATE_FILE), float(forgotten_after) * 60)
