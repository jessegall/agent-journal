from features.base import Behaviour, FeatureDetails


class StatusLineDetails(FeatureDetails):
    name = "status_bar"
    has_skill = False

    title = "Status bar"

    abstract = """
        The journal says what the bar shows — what the agent is running, and how much of its
        plan is left — and the viewer renders it
    """

    help = """
        Four stages, one after the other: the provider records every command that runs on
        your ring; dissect takes one apart into its kind and the names it worked on; group
        joins consecutive commands of the same kind; queue turns each group into a status
        message with its verb, its rolling parts, its counts and how long it stays.

        The viewer plays the queue and decides nothing of its own. Plan usage is read through
        the provider for the session bar; providers without accessible data explain their
        native source.
    """

    aliases = (("usage", "usage"), "statusline")

    behaviours = [
        Behaviour(
            name="usage",
            title="Show how much of the plan is left",
            abstract="The provider's plan windows, read from the live CLI",
        ),
    ]
