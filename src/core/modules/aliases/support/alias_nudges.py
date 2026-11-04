from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

ALIAS_UNEXPANDED = NudgeDeclaration("aliases.unexpanded", NudgeType.REFUSAL, "the alias in this line could not be expanded: journal alias edit <name>")
ALIAS_ACCESS_REFUSED = NudgeDeclaration("aliases.access_refused", NudgeType.REFUSAL, "this agent runs only aliases marked for agents: ask the main agent to mark this one")
ALIAS_MISSING = NudgeDeclaration("aliases.missing", NudgeType.REFUSAL, "the alias in this line no longer exists: journal alias list")
SAVED_COMMAND_LINE = 300
SAVED_COMMAND_UNKNOWN = NudgeDeclaration("aliases.saved_command_unknown", NudgeType.REFUSAL,
                                         'save it: journal alias add <name> "{command}" --category "{category}", or journal alias skip --reason "<why>" && it',
                                         longest_characters=SAVED_COMMAND_LINE)
SAVED_COMMAND_CHOICES = NudgeDeclaration("aliases.saved_command_choices", NudgeType.REFUSAL,
                                         'use {items} with --tail, --head or --cut, or save it: journal alias add <name> "{command}" --category "{category}"',
                                         longest_characters=SAVED_COMMAND_LINE)
SAVED_COMMAND_SUBAGENT = NudgeDeclaration("aliases.saved_command_subagent", NudgeType.REFUSAL,
                                          'a subagent only reads: ask your parent to save this {category}, or journal alias skip --reason "<why>" && it',
                                          longest_characters=SAVED_COMMAND_LINE)
SAVED_COMMAND_DIRECT = NudgeDeclaration("aliases.saved_command_direct", NudgeType.REFUSAL, "this runs through a saved command: journal {name} --tail 20, and read more with journal output read <n>",
                                        longest_characters=SAVED_COMMAND_LINE)
SAVED_COMMAND_PIPED = NudgeDeclaration("aliases.saved_command_piped", NudgeType.REFUSAL, "journal {name} takes no pipe: use --tail, --head or --cut A-B, its whole output is kept",
                                       longest_characters=SAVED_COMMAND_LINE)
SAVED_COMMAND_UNREAD = NudgeDeclaration("aliases.saved_command_unread", NudgeType.REFUSAL, "journal {name} needs --tail, --head or --cut A-B, since its whole output is too much to read",
                                        longest_characters=SAVED_COMMAND_LINE)
