from framework.parts import Command, Context
from features.starting_agents.launch import launch
from resources.base import DEFAULT_PROVIDER
from resources.base import AGENT, Refused
from serving import SERVED, Providers


def no_such_agent(agent: str) -> str:
    """The refusal for an agent nobody runs here, naming the ones that are."""
    return f"no agent called {agent!r}; the agents are {', '.join(SERVED.given(Providers).named())}"


class Launch(Command):
    name = "launch"

    def run(self, context: Context, environments, n: int, agent: str = DEFAULT_PROVIDER):
        if environments.actor == AGENT:
            environments._refuse("only the user starts an agent in an environment: they do it from the viewer")
        if not SERVED.given(Providers).knows(agent):
            raise Refused(no_such_agent(agent))
        env = environments.load(n)
        environments.vacant(env.title)
        return launch(environments, env, agent)
