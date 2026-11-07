from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

ALIAS_UNEXPANDED = NudgeDeclaration("aliases.unexpanded", NudgeType.REFUSAL, "the alias in this line could not be expanded: journal alias edit <name>")
ALIAS_ACCESS_REFUSED = NudgeDeclaration("aliases.access_refused", NudgeType.REFUSAL, "this agent runs only aliases marked for agents: ask the main agent to mark this one")
ALIAS_MISSING = NudgeDeclaration("aliases.missing", NudgeType.REFUSAL, "the alias in this line no longer exists: journal alias list")
SAVED_COMMAND_TIMEOUT = NudgeDeclaration("aliases.saved_command_timeout", NudgeType.REFUSAL, 'this --timeout does not read as a duration: use seconds, or 30s, 5m, 2h or 1d')
SAVED_COMMAND_UNKNOWN = NudgeDeclaration("aliases.saved_command_unknown", NudgeType.REFUSAL,
                                         'save this command with journal alias add <name> "<command>" --category "{category}"')
SAVED_COMMAND_MIXED = NudgeDeclaration("aliases.saved_command_mixed",NudgeType.REFUSAL, "a test or build runs on a line of its own: run the other commands apart from it")
SAVED_COMMAND_CHOICES = NudgeDeclaration("aliases.saved_command_choices", NudgeType.REFUSAL,
                                         'use a saved {category} with --tail, --head or --cut: journal alias list names them')
SAVED_COMMAND_HELPER = NudgeDeclaration("aliases.saved_command_helper", NudgeType.REFUSAL,
                                          'a helper only reads: ask your parent to run journal alias add for this {category}')
SAVED_COMMAND_DIRECT = NudgeDeclaration("aliases.saved_command_direct", NudgeType.REFUSAL, "this runs through a saved command: journal {name} --tail 20")
SAVED_COMMAND_PIPED = NudgeDeclaration("aliases.saved_command_piped", NudgeType.REFUSAL, "journal {name} takes no pipe: use --tail, --head or --cut A-B, its whole output is kept")
SAVED_COMMAND_UNREAD = NudgeDeclaration("aliases.saved_command_unread", NudgeType.REFUSAL, "journal {name} needs --tail, --head or --cut A-B, since its whole output is too much to read")
