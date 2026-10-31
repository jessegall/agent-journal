import os
import sys
from pathlib import Path

if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core.base.actor import Actor, ActorType
from core.base.subcommand.caller import Caller
from core.base.cli.console import USAGE_CODE, Console
from core.base.cli.module_sync_line import SYNC_ARGV, ModuleSyncLine
from core.base.journal_container import opened_container, synced_container
from core.base.journal_home import JournalHome
from core.base.registry.registry import StaleRegistryError

HOME_VARIABLE = "JOURNAL_HOME"
ACTOR_VARIABLES = ("JOURNAL_ACTOR_ID", "JOURNAL_ACTOR_TYPE")
ENVIRONMENT_VARIABLE = "JOURNAL_ENVIRONMENT_ID"


def main(argv: list[str]) -> int:
    home = JournalHome(Path(os.environ.get(HOME_VARIABLE, ".journal")))
    if argv[:2] == SYNC_ARGV:
        return opened_container(home).get(ModuleSyncLine).run(argv, sys.stdout)
    try:
        container = synced_container(home)
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
