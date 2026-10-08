from features.integrations.details import IntegrationDetails


class LinearDetails(IntegrationDetails):
    explains = "The journal reads your Linear issues into tickets. It is off until you switch it on and pick the key it signs in with."
    name = "linear"
    label = "Use Linear"
    hint = "Reads your Linear issues, once you pick a key"
    position = 10

    title = "Linear"

    abstract = "Your Linear issues, read into tickets by the journal; the key stays in your secrets"

    help = """
        Linear is off until you switch it on under Integrations and pick the key to sign in with, a personal Linear
        API key kept in your secrets. The journal sends the key only to api.linear.app, from its own process, and never
        shows it to an agent: only you pick it.
    """
