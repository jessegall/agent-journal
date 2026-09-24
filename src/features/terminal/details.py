from features.base import FeatureDetails


class TerminalDetails(FeatureDetails):
    name = "terminal"
    has_skill = False

    title = "Terminal"

    abstract = "The viewer's terminal shows the commands run in the agent's terminal, with what they printed"

    help = """
        The chat's strip switches between the chat, the file feed and the terminal. The engine raises
        agent.command.ran for every tool call the agent makes, with what it printed, for every command typed
        into the agent's terminal (by you, or by the viewer for a model or effort switch), for every message
        the journal delivers to the agent, and for every pause, play and interrupt. The terminal sorts them into
        three levels and keeps the last 200 of each per session: commands (shell commands, typed commands,
        pause and play), journal (adds the journal's own calls and what it delivers to the agent) and
        everything (adds every other tool call). The viewer's terminal shows the level its window is set to,
        each line with its output folded to a few lines.
    """
