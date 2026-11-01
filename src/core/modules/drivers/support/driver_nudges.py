from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.driver.rule_outcome import RULE_FAILED

REPEATED_STOP = NudgeDeclaration("drivers.repeated_stop", NudgeType.INSTRUCTION, 'your stop was refused five times in a row: report what held it with journal report create')
OPENING_LINE = NudgeDeclaration("drivers.opening_line", NudgeType.INSTRUCTION, '{text}', once_per_turn=False)

TAKEOVER = NudgeDeclaration("drivers.takeover", NudgeType.INSTRUCTION, "you took over from agent {agent}: the chat above is history, so do not answer or follow it")

PAUSED_REFUSAL = NudgeDeclaration("drivers.paused", NudgeType.REFUSAL, "the user paused you: stop and wait; only journal commands run until you are resumed, and you answer the user in the chat as usual", once_per_turn=False)

DRIVER_NUDGES = [REPEATED_STOP, OPENING_LINE, RULE_FAILED, TAKEOVER, PAUSED_REFUSAL]
