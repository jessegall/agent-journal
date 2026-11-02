from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.driver.rule_outcome import RULE_FAILED

REPEATED_STOP = NudgeDeclaration("drivers.repeated_stop", NudgeType.INSTRUCTION, 'your stop was refused five times in a row: report what held it with journal report create', pays="")
OPENING_LINE = NudgeDeclaration("drivers.opening_line", NudgeType.INSTRUCTION, '{text}', turn_limited=False)

TAKEOVER = NudgeDeclaration("drivers.takeover", NudgeType.INSTRUCTION, "you took over from agent {agent}: the chat above is history, so do not answer or follow it")

PAUSED_REFUSAL = NudgeDeclaration("drivers.paused", NudgeType.REFUSAL, 'the user paused you: only journal commands and reads run until you are resumed; answer in the chat', turn_limited=False)

MISSING_MODEL = NudgeDeclaration("drivers.missing_model", NudgeType.REFUSAL, "name a model in the dispatch: the least expensive one that reliably fits the work", turn_limited=False)
UNBOUND_DISPATCH = NudgeDeclaration("drivers.unbound_dispatch", NudgeType.REFUSAL, "the dispatch has no concrete job: give it a description and a bounded prompt", turn_limited=False)
LONG_OUTPUT = NudgeDeclaration("drivers.long_output", NudgeType.REMARK, "that result was {lines} lines: read a range, or read the output by its number, so less stays in the context", interval=Interval(Seconds(600)))

AGENT_RESUMED = NudgeDeclaration("drivers.resumed", NudgeType.REMARK, "the user resumed you: carry on where you stopped")
DEBT_COUNTDOWN = NudgeDeclaration("drivers.debt_countdown", NudgeType.INSTRUCTION, "{subject} due: {left} tool uses", turn_limited=False, pays="")
DEBT_HOLD = NudgeDeclaration("drivers.debt_hold", NudgeType.REFUSAL, '{subject} is due: do it, or journal debt skip {debt} --reason "<why>"')
DRIVER_NUDGES = [AGENT_RESUMED, DEBT_COUNTDOWN, DEBT_HOLD, REPEATED_STOP, OPENING_LINE, RULE_FAILED, TAKEOVER, PAUSED_REFUSAL, MISSING_MODEL, UNBOUND_DISPATCH, LONG_OUTPUT]
