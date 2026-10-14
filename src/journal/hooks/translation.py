from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.compacting import Compacting
from journal.events.agent.idle import Idle
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.session_ended import SessionEnded
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.subagent_ended import SubagentEnded
from journal.events.agent.subagent_started import SubagentStarted
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent.turn_written import TurnWritten
from journal.hooks.context_file import ContextFile
from journal.hooks.hook import Hook
from journal.hooks.hook_kind import HookKind
from journal.models.environment import Environment


class Translation:
    """Each hook kind to the agent event it means; one table, so no kind is ever read twice in two places."""

    EVENTS = {
        HookKind.SESSION_START: lambda hook: SessionStarted(),
        HookKind.USER_PROMPT: lambda hook: PromptSubmitted(prompt=hook.text),
        HookKind.PRE_TOOL_USE: lambda hook: ToolStarting(tool=hook.tool, input=hook.input),
        HookKind.POST_TOOL_USE: lambda hook: ToolFinished(tool=hook.tool, input=hook.input, output=hook.output),
        HookKind.PRE_COMPACT: lambda hook: Compacting(),
        HookKind.STOP: lambda hook: Idle(),
        HookKind.SUBAGENT_START: lambda hook: SubagentStarted(subagent=hook.subagent),
        HookKind.SUBAGENT_STOP: lambda hook: SubagentEnded(subagent=hook.subagent),
        HookKind.MESSAGE_DISPLAY: lambda hook: TurnWritten(text=hook.text),
        HookKind.SESSION_END: lambda hook: SessionEnded(),
    }

    def __init__(self, context: ContextFile) -> None:
        self.context = context

    def event(self, hook: Hook, environment: Environment) -> AgentEvent:
        bare = self.EVENTS[hook.kind](hook)
        return bare.placed(hook.session, environment.id, self.context.of(hook.session))
