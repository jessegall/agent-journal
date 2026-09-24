from features.base import FeatureDetails


class TerminalDetails(FeatureDetails):
    name = "terminal"
    has_skill = False

    title = "Terminal"

    abstract = "The viewer's terminal shows the commands run in the agent's terminal, with what they printed"

    help = """
        The chat's strip switches between the chat, the file feed and the terminal. The engine raises
        agent.command.ran for every shell command the agent runs, with what it printed, for every command
        the viewer types into the agent's terminal (a model or effort switch, a command you send), and for
        every pause, play and interrupt. The terminal keeps the last 200 of them per session, leaving out
        the journal's own calls, and shows each with its output folded to a few lines.
    """
