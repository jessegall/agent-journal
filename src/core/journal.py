import os
import sys
from pathlib import Path

if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core.base.actor import Actor, ActorType
from core.base.subcommand.caller import Caller
from core.base.cli.console import USAGE_CODE, Console
from core.base.cli.module_sync_line import SYNC_ARGV, ModuleSyncLine
from core.base.container import Container
from core.base.database.database import Database
from core.base.journal_home import JournalHome
from core.base.registry.registry import Registry, StaleRegistryError

HOME_VARIABLE = "JOURNAL_HOME"
ACTOR_VARIABLES = ("JOURNAL_ACTOR_ID", "JOURNAL_ACTOR_TYPE")
ENVIRONMENT_VARIABLE = "JOURNAL_ENVIRONMENT_ID"


def main(argv: list[str]) -> int:
    home = JournalHome(Path(os.environ.get(HOME_VARIABLE, ".journal")))
    database = Database.opened(home)
    container = Container()
    container.bind(JournalHome, home)
    container.bind(Database, database)
    if argv[:2] == SYNC_ARGV:
        return container.get(ModuleSyncLine).run(argv, sys.stdout)
    try:
        container.bind(Registry, Registry.read(database))
    except StaleRegistryError as error:
        print(error)
        return USAGE_CODE
    return container.get(Console).run(argv, caller(), sys.stdout)


def caller() -> Caller:
    actor_id, actor_type = (os.environ.get(variable) for variable in ACTOR_VARIABLES)
    actor = Actor(int(actor_id), ActorType(actor_type)) if actor_id and actor_type else Actor.core()
    environment = os.environ.get(ENVIRONMENT_VARIABLE)
    return Caller(actor, int(environment) if environment else None)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
