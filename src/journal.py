import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from journal.app import App  # noqa: E402
from journal.config import Config  # noqa: E402
from journal.console.where import Where  # noqa: E402

AGENTS = ("claude", "codex")


def main(argv: list[str]) -> int:
    root = Path(os.environ.get("JOURNAL_ROOT") or Path.cwd())
    if argv[:1] and argv[0] in AGENTS:
        from supervisor.launch import Launch
        return Launch.parse(argv, root).supervisor().run()
    app = App(Config.at(root))
    if argv[:1] == ["serve"]:
        app.runtime().run()
        return 0
    outcome = app.console().run(argv, Where.from_environ(os.environ))
    sys.stdout.write(outcome.out)
    sys.stderr.write(outcome.err)
    return outcome.code


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
