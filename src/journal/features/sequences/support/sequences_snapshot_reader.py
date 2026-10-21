from journal.features.sequences.support.sequences_snapshot import SequencesSnapshot
from journal.models.agent import Agent


class SequencesSnapshotReader:
    """Reads the sequences feature's part of the Snapshot for an agent."""

    def read(self, agent: Agent) -> SequencesSnapshot:
        run = agent.sequence_runs[-1] if agent.sequence_runs else {}
        steps = run.get("steps", ())
        step = int(run.get("step", 0))
        return SequencesSnapshot(sequence_id=int(run.get("sequence_id", 0)), step=step, step_text=steps[step] if step < len(steps) else "")
