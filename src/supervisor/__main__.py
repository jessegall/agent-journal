import sys
from pathlib import Path

from supervisor.bad_launch_file import BadLaunchFile
from supervisor.launch_file import LaunchFile


def main(argv: list[str]) -> int:
    if len(argv) != 1:
        print("usage: python3 -m supervisor <launch file>", file=sys.stderr)
        return 2
    try:
        launch = LaunchFile.read(Path(argv[0]))
    except BadLaunchFile as bad:
        print(bad, file=sys.stderr)
        return 2
    return launch.supervisor().run()


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
