from dataclasses import dataclass

QUESTION_START = "What: "

@dataclass(frozen=True)
class MainAgentQuestion:
    """A question to the main agent in its four parts: what is wrong, what was tried, the options and the
    recommendation, followed by the facts of the worker it is about. The merger's own question and the
    question the journal writes for an unanswered worker are both built here."""

    problem: str
    tried: str
    options: tuple[str, ...]
    recommendation: str
    facts: tuple[str, ...] = ()

    def text(self) -> str:
        options = " ".join(f"{number}) {option}" for number, option in enumerate(self.options, start=1))
        parts = [f"{QUESTION_START}{self.problem}", f"Tried: {self.tried}", f"Options: {options}", f"Recommendation: {self.recommendation}"]
        return "\n".join([*parts, *self.facts])
