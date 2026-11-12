from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

ALIAS_UNEXPANDED = NudgeDeclaration("aliases.unexpanded", NudgeType.REFUSAL, "The alias in this line could not be expanded: check its name and arguments")
ALIAS_ACCESS_REFUSED = NudgeDeclaration("aliases.access_refused", NudgeType.REFUSAL, "Agents may only run aliases marked for agents: ask the main agent to mark this one")
ALIAS_MISSING = NudgeDeclaration("aliases.missing", NudgeType.REFUSAL, "This line uses an alias that no longer exists: use the plain command or another alias")
ALIAS_PLUGIN_OFF = NudgeDeclaration("aliases.plugin_off", NudgeType.REFUSAL, "This line's alias belongs to plugin:{plugin}, which is switched off: run it another way or ask to switch it on")
SAVED_COMMAND_TIMEOUT = NudgeDeclaration("aliases.saved_command_timeout", NudgeType.REFUSAL, "Invalid --timeout: use seconds, or 30s, 5m, 2h or 1d")
SAVED_COMMAND_UNKNOWN = NudgeDeclaration("aliases.saved_command_unknown", NudgeType.REFUSAL,
                                         "Save this command as an alias of category {category}, then run the alias")
COMMAND_TYPE_UNKNOWN = NudgeDeclaration("aliases.command_type_unknown", NudgeType.REFUSAL, "{program} has an unknown command type: {hint}")
SAVED_COMMAND_MIXED = NudgeDeclaration("aliases.saved_command_mixed",NudgeType.REFUSAL, "Run a test or build on its own line, separate from other commands")
SAVED_COMMAND_CHOICES = NudgeDeclaration("aliases.saved_command_choices", NudgeType.REFUSAL,
                                         "Run this through a saved {category} alias, with --tail, --head or --cut")
SAVED_COMMAND_HELPER = NudgeDeclaration("aliases.saved_command_helper", NudgeType.REFUSAL,
                                          "Read-only helpers only read: ask your parent to save an alias for this {category}")
SAVED_COMMAND_DIRECT = NudgeDeclaration("aliases.saved_command_direct", NudgeType.REFUSAL, "This is a saved command: run journal {name} --tail 20")
SAVED_COMMAND_PIPED = NudgeDeclaration("aliases.saved_command_piped", NudgeType.REFUSAL, "journal {name} takes no pipe: use --tail, --head or --cut A-B; the full output is kept")
SAVED_COMMAND_UNREAD = NudgeDeclaration("aliases.saved_command_unread", NudgeType.REFUSAL, "journal {name} needs --tail, --head or --cut A-B: its full output is too long to read")
SAVED_COMMAND_SILENT = NudgeDeclaration("aliases.saved_command_silent", NudgeType.REFUSAL, "Alias {name} printed nothing for 30s on its last run: make it print each step, then rerun it")
