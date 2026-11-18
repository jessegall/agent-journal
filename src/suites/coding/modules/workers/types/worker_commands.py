from dataclasses import dataclass
from collections.abc import Sequence

from engine.enums.command_category import CommandCategory
from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.enums.journal_line_class import JournalLineClass


@dataclass(frozen=True)
class WorkerCommands(CommandAllowList):
    """What a coding worker may run: every shell command category and every journal line, by the user's choice
    (version 6 project, user message 4801)."""

    categories: Sequence[CommandCategory] = tuple(CommandCategory)
    groups: Sequence[str] = ("proof", "worker", "todo-item", "memory")
    lines: Sequence[str] = ("task show", "task overview", "task context", "task log", "task start", "task info", "task inspect", "task list", "plan context",
                            "doc show", "doc list", "doc make", "doc edit", "doc open", "doc close", "doc revisions", "doc revision", "doc comments", "doc settle",
                            "report show", "report list", "output read", "output title", "reader draft", "helper run", "skill write",
                            "search find", "refusal skip", "refusal confirm", "refusal withdraw", "task block", "task unblock", "task focus",
                            "task test", "task tag", "task make", "wait stuck", "task tags", "task graph",
                            "alias list", "command-type list", "reader list", "plugin file", "reader add", "plan focus", "task release", "task retest", "task close",
                            "task comments", "helper-grant show", "agent-line list", "agent-line show", "process holds", "output watch", "wait end",
                            "skill require", "helper start", "helper send", "helper stop", "worker-operation run",
                            "review request", "output stop", "reader unreadable", "hook-call show",
                            "assign-rule list", "setting request", "message edit")
    classes: Sequence[JournalLineClass] = tuple(JournalLineClass)
