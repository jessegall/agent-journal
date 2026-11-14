from engine.enums.command_category import CommandCategory
from engine.query.conditions.among import Among
from engine.query.expressions.column import Column
from engine.query.select import Select

LONG_RUNNING_CATEGORIES = [category.value for category in CommandCategory if category.is_long_running]
SAVED_COMMANDS_SELECT = Select("aliases").selecting(*(Column(name) for name in ("id", "name", "line", "category"))).matching(
    Among("category", LONG_RUNNING_CATEGORIES)).view_sql()
