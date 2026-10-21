from journal.engine.clock import Clock
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.compacting import Compacting
from journal.events.agent.stop import Stop
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.session_ended import SessionEnded
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.subagent_ended import SubagentEnded
from journal.events.agent.subagent_started import SubagentStarted
from journal.events.agent.tool_failed import ToolFailed
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent.turn_displayed import TurnDisplayed
from journal.support.context_file import ContextFile
from journal.support.hook import Hook
from journal.hooks.support.turn_gatherer import TurnGatherer
from journal.hooks.tool_uses import ToolUses
from journal.support.hook_kind import HookKind
from journal.models.environment import Environment
from journal.providers.providers import Providers
from journal.repositories.entries import Entries


class Translation:
    """Each hook kind to the agent event it means; one table, so no kind is ever read twice in two places."""

    EVENTS = {
        HookKind.SESSION_START: lambda hook, provider: SessionStarted(source=hook.source),
        HookKind.USER_PROMPT: lambda hook, provider: PromptSubmitted(prompt=hook.text),
        HookKind.PRE_TOOL_USE: lambda hook, provider: ToolStarting(call=provider.call(hook.tool, hook.input)),
        HookKind.POST_TOOL_USE: lambda hook, provider: ToolFinished(call=provider.call(hook.tool, hook.input), output=hook.output, response=hook.response),
        HookKind.POST_TOOL_USE_FAILURE: lambda hook, provider: ToolFailed(call=provider.call(hook.tool, hook.input), error=hook.error),
        HookKind.PRE_COMPACT: lambda hook, provider: Compacting(),
        HookKind.STOP: lambda hook, provider: Stop(held_before=hook.stop_held_before),
        HookKind.SUBAGENT_START: lambda hook, provider: SubagentStarted(subagent=hook.subagent),
        HookKind.SUBAGENT_STOP: lambda hook, provider: SubagentEnded(subagent=hook.subagent),
        HookKind.MESSAGE_DISPLAY: lambda hook, provider: TurnDisplayed(text=hook.text, delta=hook.text, turn_id=hook.turn_id, index=hook.index, final=hook.final),
        HookKind.SESSION_END: lambda hook, provider: SessionEnded(),
    }

    def __init__(self, context: ContextFile, providers: Providers, turns: TurnGatherer, entries: Entries, clock: Clock, uses: ToolUses) -> None:
        self.context, self.providers, self.turns = context, providers, turns
        self.entries, self.clock, self.uses = entries, clock, uses

    def event(self, hook: Hook, environment: Environment) -> AgentEvent:
        bare = self.EVENTS[hook.kind](hook, self.providers.lookup(hook.provider))
        return self.turns.fold(self.uses.counted(bare.placed(hook.session, environment.id, hook.provider, self.context.of(hook.session), self.clock.time(), hook.subagent)))
