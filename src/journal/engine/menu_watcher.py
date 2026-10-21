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
                    with self.scope.environment(agent.environment_id):
                        self.check(agent)

    def check(self, agent: Agent) -> str:
        environment, moment = agent.environment_id, time.time()
        menu = Menu.parsed(self.supervisor.screen(environment)[-8192:])
        if menu is None or not (menu.foreign() or self.answers_permission(menu, environment)):
            self._seen.pop(environment, None)
            self._answered.pop(environment, None)
            return ""
        if self._seen.get(environment) != menu.signature():
            self._seen[environment], self._seen_at[environment] = menu.signature(), moment
        if self._answered.get(environment) == menu.signature() or self.is_drawing(environment, moment):
            return ""
        user_owned = self.supervisor.key_time(environment) > self._seen_at[environment] - USER_KEY_WINDOW_SECONDS
        if user_owned and not menu.confirming():
            return ""
        triggered = user_owned or self.supervisor.choice_time(environment) > self._seen_at[environment] - CAUSE_WINDOW_SECONDS
        decided = self.decided(menu, triggered, agent)
        if decided is None:
            return ""
        keys, line_text = decided
        self.supervisor.keys(environment, keys)
        if triggered:
            self.supervisor.confirmed(environment)
        self._answered[environment] = menu.signature()
        self.cards.show(environment, agent.session, f'A menu in the agent\'s terminal was answered: "{menu.question[-160:]}" The journal {line_text}.', "bolt", shows=CardKind.MENUS)
        return keys

    def answers_permission(self, menu: Menu, environment: int) -> bool:
        return menu.asking_permission() and self.launches.skips_prompts(environment)

    def is_drawing(self, environment: int, moment: float) -> bool:
        return self._seen_at[environment] == moment and moment - self.supervisor.screen_change_time(environment) < STILLNESS_SECONDS

    def decided(self, menu: Menu, triggered: bool, agent: Agent) -> tuple[str, str] | None:
        if triggered or menu.trusting() or menu.switching_model():
            claimed = menu.accepting()
            return menu.keys(claimed), f'chose "{claimed.label}", since it confirms what was asked for' if triggered else f'chose "{claimed.label}"'
        if self.answers_permission(menu, agent.environment_id):
            claimed = menu.accepting()
            return menu.keys(claimed), f'chose "{claimed.label}", since the launch skips the permission prompts'
        claimed = self.answers.stored_answer(menu) or menu.declining() or self.answers.query(menu, agent)
        if claimed is None and self.answers.is_asking(menu):
            return None
        claimed = claimed or self.answers.query(menu, agent)
        if claimed:
            return menu.keys(claimed), f'chose "{claimed.label}"'
        return ESCAPE, "closed it with Escape, since even an asked agent could not say what it was for"
