import time

from agents.terminal import detached
from features.parts import Command, Context
from providers import DRIVERS
from resources.base import AGENT, Refused


class Launch(Command):
    name = "launch"

    def run(self, context: Context, environments, n: int, agent: str = "claude"):
        if environments.actor == AGENT:
            raise Refused("only the user starts an agent in an environment: they do it from the viewer")
        if agent not in DRIVERS:
            raise Refused(f"no agent called {agent!r}; the agents are {', '.join(DRIVERS)}")
        env = environments.load(n)
        environments.vacant(env.title)
        detached(environments.record.root, environments.record.root.parent, env.title, agent, [*DRIVERS[agent].AUTO_ARGS])
        return environments.update(env.n, launched=time.time(), launched_agent=agent)
