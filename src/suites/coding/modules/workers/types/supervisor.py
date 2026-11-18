from dataclasses import replace

from engine.enums.access import Access
from engine.enums.command_category import CommandCategory
from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.enums.journal_line_class import JournalLineClass
from core.modules.helpers.types.helper import Helper

EVERY_COMMAND = CommandAllowList(categories=tuple(CommandCategory), classes=tuple(JournalLineClass))


class Supervisor(Helper):
    """A helper that may do everything the main agent does: it writes in the project's own checkout, runs every
    shell command and every journal line, and sends and merges workers, so it keeps the workers going in the
    main agent's place."""

    key = "supervisor"
    label = "Supervisor"
    access = Access.WRITING
    line = "Does whatever the main agent does: writes, sends and merges workers, answers their questions."
    behaviours = replace(Helper.behaviours, dispatches=True)
    commands = EVERY_COMMAND
