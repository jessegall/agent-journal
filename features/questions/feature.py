from features.base import Feature


class Questions(Feature):
    name = "questions"
    title_ = "Questions"
    abstract_ = "A decision only the user can make is asked as a question, and the answer they pick is held for a moment before it is saved"
    help_ = "A question or a suggestion is answered by clicking a choice; the choice is held for a moment before it is saved, and clicking it again in that moment takes it back. questions.hold sets the moment in seconds, three by default."
    fixed = True
    hold_for = 3

    def held_for(self, record) -> float:
        return float(record.questions.get("hold", self.hold_for))
