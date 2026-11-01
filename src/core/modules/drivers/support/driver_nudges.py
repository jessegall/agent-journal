from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.driver.rule_outcome import RULE_FAILED

REPEATED_STOP = NudgeDeclaration("drivers.repeated_stop", NudgeType.INSTRUCTION, 'your stop was refused five times in a row: report what held it with journal report create')
OPENING_LINE = NudgeDeclaration("drivers.opening_line", NudgeType.INSTRUCTION, '{text}', once_per_turn=False)

TAKEOVER = NudgeDeclaration("drivers.takeover", NudgeType.INSTRUCTION, "you took over from agent {agent}: the chat above is history, so do not answer or follow it")

PAUSED_REFUSAL = NudgeDeclaration("drivers.paused", NudgeType.REFUSAL, "the user paused you: stop and wait; only journal commands run until you are resumed, and you answer the user in the chat as usual", once_per_turn=False)

MISSING_MODEL = NudgeDeclaration("drivers.missing_model", NudgeType.REFUSAL, "name a model in the dispatch: the least expensive one that reliably fits the work", once_per_turn=False)
UNBOUND_DISPATCH = NudgeDeclaration("drivers.unbound_dispatch", NudgeType.REFUSAL, "the dispatch has no concrete job: give it a description and a bounded prompt", once_per_turn=False)
LONG_OUTPUT = NudgeDeclaration("drivers.long_output", NudgeType.REMARK, "that result was {lines} lines: read a range, or read the output by its number, so less stays in the context", repeat_seconds=600)

DRIVER_NUDGES = [REPEATED_STOP, OPENING_LINE, RULE_FAILED, TAKEOVER, PAUSED_REFUSAL, MISSING_MODEL, UNBOUND_DISPATCH, LONG_OUTPUT]
