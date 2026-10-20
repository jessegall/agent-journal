from journal.features.sequences.support.sequences_standing import SequencesStanding
from journal.models.agent import Agent


class SequencesStandingReader:
    """Reads the sequences feature's part of the Standing for an agent."""

    def read(self, agent: Agent) -> SequencesStanding:
        run = agent.sequence_runs[-1] if agent.sequence_runs else {}
        steps = run.get("steps", ())
        step = int(run.get("step", 0))
        return SequencesStanding(sequence_id=int(run.get("sequence_id", 0)), step=step, step_text=steps[step] if step < len(steps) else "")
