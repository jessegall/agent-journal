import re
from collections.abc import Sequence

from core.base.driver.hook_event_name import HookEventName
from core.base.module.module import Module
from core.base.provider.provider import Provider

PROGRAM_NAME = re.compile(r"[a-z][a-z0-9_-]*")
REQUIRED_EVENTS = (HookEventName.SESSION_START, HookEventName.STOP, HookEventName.PRE_TOOL_USE)


class ProviderCheck:
    """Checks the agent programs the modules add before a sync writes anything: one module per program name,
    a plain lowercase name, the session start, stop and tool hooks mapped, and lines, refusals and subagent
    hooks only on hooks the program sends."""

    def problems(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        owners: dict[str, list[str]] = {}
        for module in modules:
            for provider in module.providers:
                owners.setdefault(provider.name, []).append(module.name)
        problems = [f"two modules provide the agent program {name}: {' and '.join(names)}" for name, names in owners.items() if len(names) > 1]
        for module in modules:
            for provider in module.providers:
                problems += self.provider_problems(provider)
        return tuple(problems)

    def provider_problems(self, provider: type[Provider]) -> list[str]:
        mapped = set(provider.hook_events.values())
        problems = [] if PROGRAM_NAME.fullmatch(provider.name) else [f"the agent program {provider.name!r} is not a lowercase name of letters, digits, - and _"]
        problems += [f"the agent program {provider.name} maps no hook to {event.value}" for event in REQUIRED_EVENTS if event not in mapped]
        problems += [f"the agent program {provider.name} takes lines on {event.value}, which it never sends" for event in provider.line_events if event not in mapped]
        problems += [f"the agent program {provider.name} refuses on {event.value}, which it never sends" for event in provider.refusals if event not in mapped]
        problems += [f"the agent program {provider.name} sends {hook} for a subagent, which is none of its hooks" for hook in provider.subagent_events
                     if hook not in provider.hook_events]
        return problems
