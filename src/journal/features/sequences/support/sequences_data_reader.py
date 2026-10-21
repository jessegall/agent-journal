from datetime import datetime, timezone

from journal.features.sequences.support.sequences_data import SequencesData
from journal.models.agent import Agent
from journal.providers.providers import Providers
from journal.repositories.entries import Entries
from journal.repositories.questions import Questions
from journal.repositories.workers import Workers
from journal.support.sequence_run import SequenceRun

STEP_KEYS = ("sequences.step_to_follow", "sequences.sequence_parked", "sequences.following_the_step")
DISTANT_SECONDS = 10.0 ** 9


class SequencesDataReader:
    """Reads the sequences feature's part of the feature data for an agent, from the run on its row and the record: the step lines typed and the tool uses."""

    def __init__(self, entries: Entries, questions: Questions, workers: Workers, providers: Providers) -> None:
        self.entries, self.questions, self.workers, self.providers = entries, questions, workers, providers

    def read(self, agent: Agent) -> SequencesData:
        if not agent.sequence_runs:
            return SequencesData.empty(DISTANT_SECONDS)
        run = SequenceRun.build(agent.sequence_runs[-1])
        uses = self.entries.tool_starts(agent.session, last=1)
        last_line = self.entries.last_line_entry(agent.session, STEP_KEYS)
        started = datetime.fromisoformat(run.started_at).timestamp() if run.started_at else 0.0
        keyed_at = last_line.creation_time.timestamp() if last_line and last_line.creation_time.timestamp() >= started else 0.0
        line_time = max(keyed_at, datetime.fromisoformat(run.announced_at).timestamp() if run.announced_at else 0.0)
        return SequencesData(
            sequence_id=run.sequence_id, step=run.step + 1, step_text=run.text, suspension_reason=run.suspension_reason, is_adopted=bool(run.adopted_at),
            adoption_edits=self.edit_count(agent, run),
            step_repeated=line_time > (uses[0].creation_time.timestamp() if uses else 0.0),
            step_silence_seconds=datetime.now(timezone.utc).timestamp() - line_time if line_time else DISTANT_SECONDS,
            is_typable=not any(agent.session in (w.session, w.resume) for w in self.workers.global_matching(environment_id=agent.environment_id)),
            question_open=bool(self.questions.open()),
            obligations_due=not agent.has_overview or bool(agent.threshold_due) or bool(agent.skills_due))

    def edit_count(self, agent: Agent, run: SequenceRun) -> int:
        if not run.adopted_at:
            return 0
        start = datetime.fromisoformat(run.adopted_at)
        provider = self.providers.lookup(agent.provider)
        later = [e for e in self.entries.tool_starts(agent.session)[1:] if e.created_at and e.created_at > start and not (e.data.get("agent_id") or e.data.get("subagent_id"))]
        return sum(1 for e in later if e.is_write())
