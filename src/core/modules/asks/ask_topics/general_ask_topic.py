from engine.module.ask_topic import AskTopic


class GeneralAskTopic(AskTopic):
    """The ask topic general."""

    key = "general"
    waiting_work = "go on with anything the task still holds, or stop"
