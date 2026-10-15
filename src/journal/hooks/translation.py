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
from journal.hooks.turn_gatherer import TurnGatherer
from journal.hooks.hook_kind import HookKind
from journal.models.environment import Environment
from journal.providers.providers import Providers
from journal.repositories.entries import Entries


class Translation:
    """Each hook kind to the agent event it means; one table, so no kind is ever read twice in two places."""

    EVENTS = {
        HookKind.SESSION_START: lambda hook, provider: SessionStarted(source=hook.source),
        HookKind.USER_PROMPT: lambda hook, provider: PromptSubmitted(prompt=hook.text),
        HookKind.PRE_TOOL_USE: lambda hook, provider: ToolStarting(tool=hook.tool, input=hook.input, writes=provider.writes(hook.tool, hook.input)),
        HookKind.POST_TOOL_USE: lambda hook, provider: ToolFinished(tool=hook.tool, input=hook.input, output=hook.output, read_path=provider.read_path(hook.tool, hook.input), skill_loaded=provider.skill_loaded(hook.tool, hook.input)),
        HookKind.PRE_COMPACT: lambda hook, provider: Compacting(),
        HookKind.STOP: lambda hook, provider: Idle(again=hook.stop_again),
        HookKind.SUBAGENT_START: lambda hook, provider: SubagentStarted(subagent=hook.subagent),
        HookKind.SUBAGENT_STOP: lambda hook, provider: SubagentEnded(subagent=hook.subagent),
        HookKind.MESSAGE_DISPLAY: lambda hook, provider: TurnWritten(text=hook.text, delta=hook.text, turn_id=hook.turn_id, index=hook.index, final=hook.final),
        HookKind.SESSION_END: lambda hook, provider: SessionEnded(),
    }

    def __init__(self, context: ContextFile, providers: Providers, turns: TurnGatherer, entries: Entries) -> None:
        self.context, self.providers, self.turns = context, providers, turns
        self.entries = entries

    def again(self, hook: Hook, environment: Environment) -> bool:
        """A stop is the same stop again only when the agent did nothing since the one before it: once it has worked, a stop is a fresh stop, whatever the provider's flag says."""
        if not hook.stop_again:
            return False
        stops = [e for e in self.entries.of_kind(environment.id, "Idle", 20) if e.actor and e.actor.id == hook.session]
        if not stops:
            return True
        return not any(e.id > stops[0].id for e in self.entries.of_kind(environment.id, "ToolStarting", 50) if e.actor and e.actor.id == hook.session)

    def event(self, hook: Hook, environment: Environment) -> AgentEvent:
        bare = self.EVENTS[hook.kind](hook, self.providers.named(hook.provider))
        if isinstance(bare, Idle):
            bare = Idle(again=self.again(hook, environment))
        return self.turns.fold(bare.placed(hook.session, environment.id, hook.provider, self.context.of(hook.session)))
