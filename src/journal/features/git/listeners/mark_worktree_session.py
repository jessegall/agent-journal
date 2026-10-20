from journal.config import Config
from journal.events.agent.session_started import SessionStarted
from journal.events.agent_listener import AgentListener
from journal.repositories.environments import Environments
from journal.support.cards import Cards
from journal.support.worktree import Worktree
from journal.support.chat_mark import ChatMark


class MarkWorktreeSession(AgentListener[SessionStarted]):
    """A session that starts in an environment with a worktree is marked in the chat with the worktree and its branch, once a session."""

    def __init__(self, config: Config, environments: Environments, cards: Cards) -> None:
        self.config, self.environments, self.cards = config, environments, cards

    def handle(self, event: SessionStarted) -> None:
        tree = Worktree(self.config.root, self.environments.find(event.environment_id).name)
        if not tree.path.is_dir():
            return
        self.cards.show(event.environment_id, event.session, f"Working in the worktree {tree.name}, on the branch {tree.current_branch()}", "branch", key=f"worktree:{event.session}", shows=ChatMark.WORKTREES)
