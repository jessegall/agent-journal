from features.base import Feature


class Answers(Feature):
    name = "answers"
    title_ = "Answers"
    abstract_ = "How an answer picked in the viewer is saved, and the moment it can be taken back"
    help_ = "A question or a suggestion is answered by clicking a choice; the choice is held for a moment before it is saved, and clicking it again in that moment takes it back. answers.hold sets the moment in seconds, three by default."
    fixed = True
    hold_for = 3

    def held_for(self, record) -> float:
        return float(record.answers.get("hold", self.hold_for))
