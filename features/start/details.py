from features.base import FeatureDetails, Line


class StartDetails(FeatureDetails):
    name = "start"

    title = "The start block"

    abstract = "What a session is handed at its start, kept current on every change to the record"

    help = """
        The hook hands the file over at SessionStart; nothing is computed inside the hook.

        The first time a session starts, the journal types a line into the agent's terminal,
        never the channel, asking it to say something in the chat so the journal's messages
        reach it.
    """

    lines = [
        Line(
            name="ready",
            title="the journal is ready on {{env}}",
            brief="say hello in the chat, so the journal's messages reach you",
        ),
    ]
