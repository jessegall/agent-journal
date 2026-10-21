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
from journal.engine.support.launch_files import LaunchFiles
from journal.engine.support.menu_answers import MenuAnswers
from journal.support.card_kind import CardKind

INTERVAL = 0.5
STILLNESS_SECONDS = 1.5
CAUSE_WINDOW_SECONDS = 15.0
USER_KEY_WINDOW_SECONDS = 3.0


class MenuWatcher:
    """A thread that reads each live agent's screen through the supervisor's mirror and keeps the agent from sitting at a menu: one the journal caused is confirmed, the trust question for the launched folder accepted, anything else declined or closed with Escape, and a card in the chat says what was done; a menu the user opened at the keyboard is left alone. A menu is answered at the first look when the screen has stood still, otherwise at the next look that finds the same menu, whatever a spinner above it does."""

    def __init__(self, agents: Agents, supervisor: SupervisorLink, cards: Cards, scope: Scope, states: StatesCatalogue, answers: MenuAnswers, launches: LaunchFiles) -> None:
        self.agents, self.supervisor, self.cards, self.scope, self.states = agents, supervisor, cards, scope, states
        self.answers, self.launches = answers, launches
        self._stopping = threading.Event()
        self._seen: dict[int, tuple] = {}
        self._seen_at: dict[int, float] = {}
        self._answered: dict[int, tuple] = {}

    def start(self) -> None:
        threading.Thread(target=self._run, name="menu-watcher", daemon=True).start()

    def stop(self) -> None:
        self._stopping.set()

    def _run(self) -> None:
        while not self._stopping.wait(INTERVAL):
            for agent in self.agents.all_agents():
                if not isinstance(self.states.restored(agent.state, agent.data), Ended):
                    with self.scope.of(agent.environment_id):
                        self.check(agent)

    def check(self, agent: Agent) -> str:
        env, moment = agent.environment_id, time.time()
        menu = Menu.on(self.supervisor.screen(env)[-8192:])
        if menu is None or not (menu.foreign() or self.answers_permission(menu, env)):
            self._seen.pop(env, None)
            self._answered.pop(env, None)
            return ""
        if self._seen.get(env) != menu.signature():
            self._seen[env], self._seen_at[env] = menu.signature(), moment
        if self._answered.get(env) == menu.signature() or self.still_drawing(env, moment):
            return ""
        yours = self.supervisor.key_time(env) > self._seen_at[env] - USER_KEY_WINDOW_SECONDS
        if yours and not menu.confirming():
            return ""
        caused = yours or self.supervisor.choice_time(env) > self._seen_at[env] - CAUSE_WINDOW_SECONDS
        decided = self.decided(menu, caused, agent)
        if decided is None:
            return ""
        keys, said = decided
        self.supervisor.keys(env, keys)
        if caused:
            self.supervisor.confirmed(env)
        self._answered[env] = menu.signature()
        self.cards.show(env, agent.session, f'A menu in the agent\'s terminal was answered: "{menu.question[-160:]}" The journal {said}.', "bolt", shows=CardKind.MENUS)
        return keys

    def answers_permission(self, menu: Menu, env: int) -> bool:
        return menu.asking_permission() and self.launches.skips_prompts(env)

    def still_drawing(self, env: int, moment: float) -> bool:
        return self._seen_at[env] == moment and moment - self.supervisor.screen_changed_at(env) < STILLNESS_SECONDS

    def decided(self, menu: Menu, caused: bool, agent: Agent) -> tuple[str, str] | None:
        if caused or menu.trusting() or menu.switching_model():
            taken = menu.accepting()
            return menu.keys(taken), f'chose "{taken.label}", since it confirms what was asked for' if caused else f'chose "{taken.label}"'
        if self.answers_permission(menu, agent.environment_id):
            taken = menu.accepting()
            return menu.keys(taken), f'chose "{taken.label}", since the launch skips the permission prompts'
        taken = self.answers.remembered(menu) or menu.declining() or self.answers.query(menu, agent)
        if taken is None and self.answers.is_asking(menu):
            return None
        taken = taken or self.answers.query(menu, agent)
        if taken:
            return menu.keys(taken), f'chose "{taken.label}"'
        return ESCAPE, "closed it with Escape, since even an asked agent could not say what it was for"
