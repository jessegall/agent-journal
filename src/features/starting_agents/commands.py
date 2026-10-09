from features.parts import Command, Context
from features.starting_agents.launch import launch
from providers import DEFAULT_PROVIDER, DRIVERS
from resources.base import AGENT, Refused


class Launch(Command):
    name = "launch"

    def run(self, context: Context, environments, n: int, agent: str = DEFAULT_PROVIDER):
        if environments.actor == AGENT:
            environments._refuse("only the user starts an agent in an environment: they do it from the viewer")
        if agent not in DRIVERS:
            raise Refused(f"no agent called {agent!r}; the agents are {', '.join(DRIVERS)}")
        env = environments.load(n)
        environments.vacant(env.title)
        return launch(environments, env, agent)
