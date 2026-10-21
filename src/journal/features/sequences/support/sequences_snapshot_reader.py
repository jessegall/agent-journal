from datetime import datetime, timezone

from journal.features.sequences.support.sequences_snapshot import SequencesSnapshot
from journal.models.agent import Agent
from journal.providers.providers import Providers
from journal.repositories.entries import Entries
from journal.repositories.questions import Questions
from journal.repositories.workers import Workers
from journal.support.sequence_run import SequenceRun

STEP_KEYS = ("sequences.step_to_follow", "sequences.sequence_parked", "sequences.following_the_step")
NEVER = 10.0 ** 9


class SequencesSnapshotReader:
    """Reads the sequences feature's part of the Snapshot for an agent, from the run on its row and the record: the step lines typed and the tool uses."""

    def __init__(self, entries: Entries, questions: Questions, workers: Workers, providers: Providers) -> None:
        self.entries, self.questions, self.workers, self.providers = entries, questions, workers, providers

    def read(self, agent: Agent) -> SequencesSnapshot:
        if not agent.sequence_runs:
            return SequencesSnapshot(0, 0, "", "", False, 0, False, NEVER, False, False, False)
        run = SequenceRun.of(agent.sequence_runs[-1])
        uses = self.entries.tool_starts(agent.session, last=1)
        last_line = self.entries.said_last(agent.session, STEP_KEYS)
        started = datetime.fromisoformat(run.started_at).timestamp() if run.started_at else 0.0
        typed_time = last_line.created_at.timestamp() if last_line and last_line.created_at.timestamp() >= started else 0.0
        line_time = max(typed_time, datetime.fromisoformat(run.said_at).timestamp() if run.said_at else 0.0)
        return SequencesSnapshot(
            sequence_id=run.sequence_id, step=run.step + 1, step_text=run.text, parked_why=run.parked_why, is_taken_up=bool(run.taken_up_at),
            writes_since_taken_up=self.writes_since(agent, run),
            step_said_after_last_tool=line_time > (uses[0].created_at.timestamp() if uses else 0.0),
            step_unsaid_seconds=datetime.now(timezone.utc).timestamp() - line_time if line_time else NEVER,
            can_be_typed=not any(agent.session in (w.session, w.resume) for w in self.workers.across_environments(environment_id=agent.environment_id)),
            question_open=bool(self.questions.open()),
            debts_owed=not agent.oriented or bool(agent.mark_owed) or bool(agent.skills_owed))

    def writes_since(self, agent: Agent, run: SequenceRun) -> int:
        if not run.taken_up_at:
            return 0
        since = datetime.fromisoformat(run.taken_up_at)
        provider = self.providers.named(agent.provider or "claude")
        later = [e for e in self.entries.tool_starts(agent.session)[1:] if e.created_at and e.created_at > since and not (e.data.get("agent_id") or e.data.get("subagent_id"))]
        return sum(1 for e in later if provider.wrote(e))
