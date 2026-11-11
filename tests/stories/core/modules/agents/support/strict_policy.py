from collections.abc import Generator
from contextlib import contextmanager

from engine.module.module import Module
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.dispatch_policy import DispatchPolicy

STRICT_POLICY = "tests.stories.core.modules.agents.support.strict_policy:StrictPolicyModule"


class StrictPolicy(DispatchPolicy):
    """A made-up suite policy: every agent should run, none that ended is gone for good, and no session may
    start now."""

    @contextmanager
    def lock(self, session: str) -> Generator[bool]:
        yield False

    def is_wanted(self, agent: Agent) -> bool:
        return True

    def is_final(self, agent: Agent) -> bool:
        return False


class StrictPolicyModule(Module):
    """A sample module of a suite that binds its own dispatch policy."""

    name = "acme.strict-policy"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents"]
    bindings = {DispatchPolicy: StrictPolicy}
