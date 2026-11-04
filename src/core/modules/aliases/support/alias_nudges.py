from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

ALIAS_UNEXPANDED = NudgeDeclaration("aliases.unexpanded", NudgeType.REFUSAL, "the alias in this line could not be expanded: journal alias edit <name>")
ALIAS_ACCESS_REFUSED = NudgeDeclaration("aliases.access_refused", NudgeType.REFUSAL, "this agent runs only aliases marked for agents: ask the main agent to mark this one")
ALIAS_MISSING = NudgeDeclaration("aliases.missing", NudgeType.REFUSAL, "the alias in this line no longer exists: journal alias list")
