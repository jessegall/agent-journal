import os
import sys
from pathlib import Path

if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core.base.caller.caller_request import CallerRequest
from core.base.cli.console import USAGE_CODE, Console
from core.base.cli.module_sync_line import SYNC_ARGV, ModuleSyncLine
from core.base.journal_container import opened_container, synced_container
from core.base.journal_home import JournalHome
from core.base.registry.registry import StaleRegistryError

HOME_VARIABLE = "JOURNAL_HOME"


def main(argv: list[str]) -> int:
    home = JournalHome(Path(os.environ.get(HOME_VARIABLE, ".journal")))
    if argv[:2] == SYNC_ARGV:
        return opened_container(home).get(ModuleSyncLine).run(argv, sys.stdout)
    try:
        container = synced_container(home)
    except StaleRegistryError as error:
        print(error)
        return USAGE_CODE
    return container.get(Console).requested_run(argv, CallerRequest(dict(os.environ), os.getcwd(), os.getpid()), sys.stdout)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
