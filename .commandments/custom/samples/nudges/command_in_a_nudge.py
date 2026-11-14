from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

# @sin architecture_nudges_command_in_a_nudge
APPROVAL_SHOWN = NudgeDeclaration("sample.show", NudgeType.NOTICE, "approval {approval} was decided: journal approval show {approval}")
# @sin architecture_nudges_command_in_a_nudge
TRIGGERS_FIRED = NudgeDeclaration("sample.plural", NudgeType.NOTICE, "trigger:{trigger} fired", plural_text="triggers {trigger} fired: read each with journal trigger show <id>")
# @sin architecture_nudges_command_in_a_nudge
OVERVIEW_FIRST = NudgeDeclaration(key="sample.named", type=NudgeType.NOTICE, text="run journal overview first")
# @righteous architecture_nudges_command_in_a_nudge
APPROVAL_DECIDED = NudgeDeclaration("sample.decided", NudgeType.NOTICE, "approval {approval} was decided")
# @righteous architecture_nudges_command_in_a_nudge
JOURNAL_STARTED = NudgeDeclaration("sample.prose", NudgeType.NOTICE, "the journal started: go on with your work")
# @righteous architecture_nudges_command_in_a_nudge
DRIVER_ACCESS = NudgeDeclaration("sample.commands", NudgeType.NOTICE, "this driver runs journal commands only")
# @righteous architecture_nudges_command_in_a_nudge
IMAGE_TAG_DUE = NudgeDeclaration("sample.paid", NudgeType.STEERING, "message:{message} has an image", required_command="journal message tag {message}")
