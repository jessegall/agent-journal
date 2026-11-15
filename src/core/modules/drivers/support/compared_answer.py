from dataclasses import dataclass

from engine.agent_machine.decision_record import DecisionRecord
from engine.driver.hook_reply import HookReply
from engine.driver.rule_answers import RuleAnswers
from engine.enums.decision_class import DecisionClass

ALLOWED_TEXT = "allow"


@dataclass(frozen=True)
class ComparedAnswer:
    """What the program is told of one answer, in a form the old walk's and the new machine's answers share:
    allowed, or refused or halted with the key that decided it and its text. A hold reads as a refusal, as
    the program sees it."""

    text: str
    key: str = ""

    @classmethod
    def old(cls, answers: RuleAnswers, reply: HookReply) -> "ComparedAnswer":
        if reply.halt:
            return cls(f"halt: {reply.halt}")
        if not reply.refusal:
            return cls(ALLOWED_TEXT)
        key = next((rule.name for rule in answers.answered if rule.answer is not None and rule.answer.refusal == reply.refusal), "")
        return cls(f"refuse {key}: {reply.refusal}", key)

    @classmethod
    def new(cls, record: DecisionRecord) -> "ComparedAnswer":
        reason = record.decision.reason
        if record.decision.decision_class is DecisionClass.ALLOW:
            return cls(ALLOWED_TEXT)
        if record.decision.decision_class is DecisionClass.HALT:
            return cls(f"halt: {reason.text}", reason.key)
        return cls(f"refuse {reason.key}: {reason.text}", reason.key)

    # the module that decided, read from the key's first part, so a comparison is read per slice
    def slice_name(self) -> str:
        return self.key.partition(".")[0]
