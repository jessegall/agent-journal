from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

ALIAS_UNEXPANDED = NudgeDeclaration("aliases.unexpanded", NudgeType.REFUSAL, "the alias in this line could not be expanded: journal alias edit <name>")
ALIAS_NOT_FOR_WORKERS = NudgeDeclaration("aliases.not_for_workers", NudgeType.REFUSAL, "a worker runs only the aliases marked for workers: ask the main agent to mark this one")
ALIAS_GONE = NudgeDeclaration("aliases.gone", NudgeType.REFUSAL, "the alias in this line no longer exists: journal alias list")
