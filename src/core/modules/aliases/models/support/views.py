from engine.enums.command_category import CommandCategory

LONG_RUNNING_CATEGORIES = ", ".join(f"'{category.value}'" for category in CommandCategory if category.is_long_running)
SAVED_COMMANDS_SELECT = f"SELECT id, name, line, category FROM aliases WHERE category IN ({LONG_RUNNING_CATEGORIES})"
