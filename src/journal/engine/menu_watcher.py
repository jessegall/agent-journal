import threading
import time

from journal.support.cards import Cards
from journal.engine.states.ended import Ended
from journal.support.states_catalogue import StatesCatalogue
from journal.models.agent import Agent
from journal.providers.support.menu import ESCAPE, Menu
from journal.repositories.agents import Agents
from journal.support.scope import Scope
from journal.supervisor_link import SupervisorLink
from journal.engine.support.menu_answers import MenuAnswers

EVERY = 1.0
"""How often the watcher looks at each agent's screen."""
QUIET = 1.5
"""A menu is answered only once the screen has been still this long, so one still being drawn is not."""
CAUSED_WITHIN = 15.0
"""A menu that came up this soon after the journal typed a command for the user was caused by it, and is confirmed."""
YOURS_WITHIN = 3.0
"""A menu that came up this soon after keys at the keyboard is the user's own, and is left to the user."""


class MenuWatcher:
    """A thread that reads each live agent's screen through the supervisor's mirror and keeps the agent from sitting at a menu: one the journal caused is confirmed, the trust question for the launched folder accepted, anything else declined or closed with Escape, and a card in the chat says what was done; a menu the user opened at the keyboard is left alone."""

    def __init__(self, agents: Agents, supervisor: SupervisorLink, cards: Cards, scope: Scope, states: StatesCatalogue, answers: MenuAnswers) -> None:
        self.agents, self.supervisor, self.cards, self.scope, self.states = agents, supervisor, cards, scope, states
        self.answers = answers
        self._stopping = threading.Event()
        self._seen: dict[int, tuple] = {}
        self._seen_at: dict[int, float] = {}
        self._answered: dict[int, tuple] = {}

    def start(self) -> None:
        threading.Thread(target=self._run, name="menu-watcher", daemon=True).start()

    def stop(self) -> None:
        self._stopping.set()

    def _run(self) -> None:
        while not self._stopping.wait(EVERY):
            for agent in self.agents.everywhere():
                if not isinstance(self.states.named(agent.state, agent.data), Ended):
                    with self.scope.of(agent.environment_id):
                        self.look(agent)

    def look(self, agent: Agent) -> str:
        """One look at the agent's screen: what was pressed, or nothing."""
        env, now = agent.environment_id, time.time()
        menu = Menu.on(self.supervisor.screen(env)[-8192:])
        if menu is None or not menu.foreign():
            self._seen.pop(env, None)
            self._answered.pop(env, None)
            return ""
        if self._seen.get(env) != menu.signature():
            self._seen[env], self._seen_at[env] = menu.signature(), now
        if self._answered.get(env) == menu.signature() or now - self.supervisor.screen_changed_at(env) < QUIET:
            return ""
        yours = self.supervisor.keyed_at(env) > self._seen_at[env] - YOURS_WITHIN
        if yours and not menu.confirming():
            return ""
        caused = yours or self.supervisor.chosen_at(env) > self._seen_at[env] - CAUSED_WITHIN
        decided = self.decided(menu, caused, agent)
        if decided is None:
            return ""
        keys, said = decided
        self.supervisor.keys(env, keys)
        if caused:
            self.supervisor.confirmed(env)
        self._answered[env] = menu.signature()
        self.cards.show(env, agent.session, f'A menu in the agent\'s terminal was answered: "{menu.question[-160:]}" The journal {said}.', "bolt")
        return keys

    def decided(self, menu: Menu, caused: bool, agent: Agent) -> tuple[str, str] | None:
        """What to press and the words for it: confirm what you or the journal asked for, or the trust question; else the answer remembered, a decline, or an asked agent's pick; none while that agent works it out; else close."""
        if caused or menu.trusting():
            taken = menu.accepting()
            return menu.keys_for(taken), f'chose "{taken.label}", since it confirms what was asked for' if caused else f'chose "{taken.label}"'
        taken = self.answers.remembered(menu) or menu.declining() or self.answers.asked(menu, agent)
        if taken is None and self.answers.is_asking(menu):
            return None
        taken = taken or self.answers.asked(menu, agent)
        if taken:
            return menu.keys_for(taken), f'chose "{taken.label}"'
        return ESCAPE, "closed it with Escape, since even an asked agent could not say what it was for"
