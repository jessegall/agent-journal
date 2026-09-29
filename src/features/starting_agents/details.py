from features.base import FeatureDetails


class StartingAgentsDetails(FeatureDetails):
    name = "starting_agents"
    has_skill = False

    title = "Start an agent in an environment"

    abstract = "The viewer's Start button, and journal environment launch, open an agent in an environment's own terminal"

    help = """
        Always on: the user starts an agent in an environment from the sidebar or when making a new
        environment, and journal environment stop ends it. Only the user starts one; an agent that
        asks is refused.
    """

    fixed = True
