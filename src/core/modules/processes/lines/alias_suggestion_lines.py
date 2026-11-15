from collections.abc import Sequence

from engine.agent.agent_role_reader import AgentRoleReader
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.query.conditions.prefix import Prefix
from core.modules.processes.nudges.alias_suggestion_message import AliasSuggestionMessage
from core.modules.processes.queries.process_query import ProcessQuery

OFTEN_RUN_COUNT = 8
SHAPE_TERMS = 3
SKIPPED_TERMS = ("journal", "git", "ls", "cat", "grep", "sed", "for", "set", "cd", "python3")


class AliasSuggestionLines(EventLineSource):
    """A command an agent keeps running, as a part of its runs opening on the same words as this one, teaches it to
    add an alias, for the roles the suite policy has use saved commands; only a shell line asks, and it only counts."""

    key = "processes.alias-suggestion"
    events = [HookEventName.POST_TOOL_USE]

    def __init__(self, processes: ProcessQuery, types: HelperTypeBook, roles: AgentRoleReader) -> None:
        self.processes, self.types, self.roles = processes, types, roles

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        shell = event.tool.shell if event is not None and event.tool is not None else None
        if shell is None or not self.types.behaviours(self.roles.role(agent_id)).runs_saved_commands:
            return []
        commands = [part.text.split()[:SHAPE_TERMS] for part in shell.parts if part.text.split()[0] not in SKIPPED_TERMS and not part.saved_command]
        if not commands:
            return []
        shape = " ".join(commands[0])
        count = self.processes.agent(agent_id).with_part(Prefix("text", shape)).count()
        return [AliasSuggestionMessage.declared().nudge(shape=shape, count=count)] if count >= OFTEN_RUN_COUNT else []
