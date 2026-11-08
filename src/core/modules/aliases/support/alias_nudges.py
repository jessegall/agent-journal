from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

ALIAS_UNEXPANDED = NudgeDeclaration("aliases.unexpanded", NudgeType.REFUSAL, "the alias in this line could not be expanded")
ALIAS_ACCESS_REFUSED = NudgeDeclaration("aliases.access_refused", NudgeType.REFUSAL, "this agent runs only aliases marked for agents: ask the main agent to mark this one")
ALIAS_MISSING = NudgeDeclaration("aliases.missing", NudgeType.REFUSAL, "the alias in this line no longer exists")
ALIAS_PLUGIN_OFF = NudgeDeclaration("aliases.plugin_off", NudgeType.REFUSAL, "the alias in this line belongs to plugin:{plugin}, which is switched off")
SAVED_COMMAND_TIMEOUT = NudgeDeclaration("aliases.saved_command_timeout", NudgeType.REFUSAL, 'this --timeout does not read as a duration: use seconds, or 30s, 5m, 2h or 1d')
SAVED_COMMAND_UNKNOWN = NudgeDeclaration("aliases.saved_command_unknown", NudgeType.REFUSAL,
                                         'save this command as an alias of category {category}')
COMMAND_TYPE_UNKNOWN = NudgeDeclaration("aliases.command_type_unknown", NudgeType.REFUSAL, "{program} is a command of unknown type: classify its leading words first")
SAVED_COMMAND_MIXED = NudgeDeclaration("aliases.saved_command_mixed",NudgeType.REFUSAL, "a test or build runs on a line of its own: run the other commands apart from it")
SAVED_COMMAND_CHOICES = NudgeDeclaration("aliases.saved_command_choices", NudgeType.REFUSAL,
                                         'use a saved {category} with --tail, --head or --cut')
SAVED_COMMAND_HELPER = NudgeDeclaration("aliases.saved_command_helper", NudgeType.REFUSAL,
                                          'a helper only reads: ask your parent to save an alias for this {category}')
SAVED_COMMAND_DIRECT = NudgeDeclaration("aliases.saved_command_direct", NudgeType.REFUSAL, "this runs through a saved command: journal {name} --tail 20")
SAVED_COMMAND_PIPED = NudgeDeclaration("aliases.saved_command_piped", NudgeType.REFUSAL, "journal {name} takes no pipe: use --tail, --head or --cut A-B, its whole output is kept")
SAVED_COMMAND_UNREAD = NudgeDeclaration("aliases.saved_command_unread", NudgeType.REFUSAL, "journal {name} needs --tail, --head or --cut A-B, since its whole output is too much to read")
SAVED_COMMAND_SILENT = NudgeDeclaration("aliases.saved_command_silent", NudgeType.REFUSAL, "alias {name} printed nothing for 30 seconds on its last run: edit it to print each step, then run it again")
