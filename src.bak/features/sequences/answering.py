from events.answers import Allowed, Answer, Kept, Refused
from events.asking import AgentMessageSending, ToolCallAsked
from features.sequences.steps import held_writes, step_held_text
from receiving import Answerer
from resources.sequences import Sequence
from serving import ReadRows


class KeepOutOfTheChat(Answerer[AgentMessageSending]):
    def answer(self, event: AgentMessageSending, sequences: ReadRows[Sequence]) -> Answer:
        found = sequences.in_hand()
        return Kept() if found and found[0].talks_in and event.text.strip() else Allowed()


class HoldJournalWritesForTheStep(Answerer[ToolCallAsked]):
    def answer(self, event: ToolCallAsked, sequences: ReadRows[Sequence]) -> Answer:
        held = None if event.subagent else held_writes(sequences, event.command)
        if held is None or held[3]:
            return Allowed()
        sequence, key, run, _ = held
        return Refused(step_held_text(sequence, key, run))
