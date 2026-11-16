from engine.viewer.window_extension import WindowExtension


class AgentsLiftBlockExtension(WindowExtension):
    """The agents list lifts a hold on an agent's output."""

    window = "agents.agents"
    runs = ["process lift-hold"]
