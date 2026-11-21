from journal.app import App
from journal.config import Config
from journal.repositories.environments import Environments
from tests.suite_app import SuiteApp


def main_journal(config: Config) -> App:
    """A journal booted on its own with the environment main made, as a user makes one before their first agent, since a journal makes none by itself."""
    app = SuiteApp(config)
    app.container.get(Environments).lookup("main")
    return app
