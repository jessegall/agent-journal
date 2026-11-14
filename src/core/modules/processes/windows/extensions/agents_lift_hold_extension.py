from engine.viewer.window_extension import WindowExtension


class AgentsLiftHoldExtension(WindowExtension):
    """The agents list lifts a hold on an agent's output."""

    window = "agents.agents"
    runs = ["process lift-hold"]
