import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from features.secrets.values import ValuesFile  # noqa: E402


def main(argv: list[str]) -> int:
    """Prints the sign-in header an agent's MCP server asks for each time it connects: the token the journal's own sign-in kept for it, read from the secrets file and never written into the agent's config."""
    root, variable = Path(argv[0]), argv[1]
    token = ValuesFile(root).values().get(variable, "")
    if not token:
        return 1
    print(json.dumps({"Authorization": token}))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
