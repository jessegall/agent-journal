from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_declaration import NudgeDeclaration as Declaration
from core.base.driver.nudge_type import NudgeType

# @sin architecture_nudges_stored_text
REPORT = NudgeDeclaration("sample.report", NudgeType.STEERING, "worker:{worker}: {report}")
# @sin architecture_nudges_stored_text
REASON = NudgeDeclaration("sample.reason", NudgeType.STEERING, "worker:{worker}: {reason}")
# @sin architecture_nudges_stored_text
COMMAND = NudgeDeclaration("sample.command", NudgeType.STEERING, "{command}", path_fields=["command"])
# @sin architecture_nudges_stored_text
ALIASED = Declaration("sample.alias", NudgeType.STEERING, "{summary}")
# @sin architecture_nudges_stored_text
PLURAL = NudgeDeclaration("sample.plural", NudgeType.STEERING, "message:{message}", plural_text="{words}")
# @sin architecture_nudges_stored_text
KEYWORDS = NudgeDeclaration(key="sample.named", type=NudgeType.NOTICE, text="{message_text}")
# @righteous architecture_nudges_stored_text
ROWS = NudgeDeclaration("sample.rows", NudgeType.STEERING, "{count} messages: {messages}")
# @righteous architecture_nudges_stored_text
PATH = NudgeDeclaration("sample.path", NudgeType.STEERING, "read {path}", path_fields=["path"])
# @righteous architecture_nudges_stored_text
OPENING = NudgeDeclaration("drivers.opening_line", NudgeType.NOTICE, "{text}")
# @righteous architecture_nudges_stored_text
FAULT = NudgeDeclaration("drivers.rule_failed", NudgeType.NOTICE, "{text}")

# @righteous architecture_nudges_stored_text
PLAIN_DICT = dict(text="{reason}")
