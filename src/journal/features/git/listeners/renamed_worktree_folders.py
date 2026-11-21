from journal.support.card_outcome import CardOutcome
from journal.chat.moment_cards import MomentCards
from journal.config import Config
from journal.events.agent.session_started import SessionStarted
from journal.events.agent_listener import AgentListener
from journal.features.git.support.launch_worktrees import LAUNCH_FOLDER, RENAMED_TAG
from journal.repositories.environments import Environments
from journal.support.actor import Actor
from journal.support.card_type import CardType


class RenamedWorktreeFolders(AgentListener[SessionStarted]):
    """A session that starts in the main environment is told once, in the chat, of the worktree folders an older version renamed out of the way, which are kept and never deleted."""

    def __init__(self, config: Config, environments: Environments, cards: MomentCards) -> None:
        self.config, self.environments, self.cards = config, environments, cards

    def handle(self, event: SessionStarted) -> None:
        main = self.environments.lookup("main").row_id
        place = self.config.root / LAUNCH_FOLDER
        renamed_folders = sorted(path.name for path in place.iterdir() if RENAMED_TAG in path.name) if place.is_dir() else []
        key = f"moved-aside:{','.join(renamed_folders)}"
        if event.environment_id != main or not renamed_folders or self.cards.is_shown(key, Actor.system()):
            return
        line = "Old copies of the project from an earlier version were kept, not deleted"
        self.cards.show(main, event.session, line, f"{', '.join(renamed_folders)}, kept in {place}", actor=Actor.system(), key=key, shows=CardType.WORKTREES, outcome=CardOutcome.WARNED)
