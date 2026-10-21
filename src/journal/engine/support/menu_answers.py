import json
import os
import re
import subprocess
import tempfile
import threading

from journal.models.agent import Agent
from journal.providers.providers import Providers
from journal.providers.support.menu import Menu
from journal.providers.support.option import Option
from journal.repositories.setting_rows import SettingRows
from journal.support.actor import Actor

CHOICES = "menu_choices"
QUERY_TIMEOUT_SECONDS = 120
EXCLUDED_VARIABLES = ("AGENT_JOURNAL_ACTIVE", "JOURNAL_ENV", "JOURNAL_SESSION", "JOURNAL_LAUNCH")


class MenuAnswers:
    """The answers to menus the word rules cannot settle: remembered from the last time, or worked out by a standalone agent asked off the watcher's thread, outside the project and with no hooks of the journal's, whose pick is kept."""

    def __init__(self, settings: SettingRows, providers: Providers) -> None:
        self.settings, self.providers = settings, providers
        self._asked: dict[str, Option | None] = {}
        self._running: set[str] = set()

    def stored_answer(self, menu: Menu) -> Option | None:
        label = dict(self.settings.project(CHOICES, {})).get(self.key(menu))
        return next((o for o in menu.options if o.label == label), None)

    def query(self, menu: Menu, agent: Agent) -> Option | None:
        key = self.key(menu)
        if key in self._asked:
            return self._asked[key]
        if key not in self._running:
            self._running.add(key)
            threading.Thread(target=self.ask, args=(menu, agent.provider), name="menu-asking", daemon=True).start()
        return None

    def is_asking(self, menu: Menu) -> bool:
        return self.key(menu) in self._running and self.key(menu) not in self._asked

    def ask(self, menu: Menu, provider: str) -> None:
        program = self.providers.lookup(provider)
        argv = program.worker_command(self.question(menu), program.question_model, "")
        excluded = (*EXCLUDED_VARIABLES, *self.providers.inherited_markers())
        environ = {k: v for k, v in os.environ.items() if k not in excluded}
        try:
            finished = subprocess.run(argv, capture_output=True, text=True, timeout=QUERY_TIMEOUT_SECONDS, stdin=subprocess.DEVNULL, cwd=tempfile.gettempdir(), env=environ)
        except (OSError, subprocess.SubprocessError):
            self._asked[self.key(menu)] = None
            return
        number = re.search(r"\d+", program.worker_outcome(finished.stdout, finished.stderr).report)
        claimed = next((o for o in menu.options if number and o.number == int(number[0])), None)
        self._asked[self.key(menu)] = claimed
        if claimed:
            self.settings.set(CHOICES, {**dict(self.settings.project(CHOICES, {})), self.key(menu): claimed.label}, Actor.system())

    @staticmethod
    def key(menu: Menu) -> str:
        return json.dumps([o.label for o in menu.options])

    @staticmethod
    def question(menu: Menu) -> str:
        options = "\n".join(f"{o.number}. {o.label}" for o in menu.options)
        return f"A coding agent's terminal shows this menu and waits for an answer.\n\nQuestion: {menu.question}\n\nOptions:\n{options}\n\nWhich option lets the agent carry on its work? Reply with the option number only."
