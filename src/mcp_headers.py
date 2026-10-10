import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from features.integrations.login import RENEWAL_SUFFIX, Renewal, renewed  # noqa: E402
from features.secrets.values import ValuesFile  # noqa: E402
from resources.base import Refused  # noqa: E402


def main(argv: list[str]) -> int:
    """Prints the sign-in header an agent's MCP server asks for each time it connects: the token the journal's own sign-in kept for it, read from the secrets file and never written into the agent's config, renewed first with its refresh token when it is about to run out."""
    root, variable = Path(argv[0]), argv[1]
    values = ValuesFile(root)
    kept = values.values()
    token, renewal = kept.get(variable, ""), Renewal.read(kept.get(variable + RENEWAL_SUFFIX, ""))
    if renewal.due():
        try:
            signin = renewed(renewal)
        except Refused as error:
            if renewal.lapsed():
                print(f"the sign-in ran out and could not be renewed: {error}; press Log in on the integration's card", file=sys.stderr)
                return 1
        else:
            token = signin.bearer
            values.put(variable, token)
            values.put(variable + RENEWAL_SUFFIX, signin.renewal.text())
    if not token:
        return 1
    print(json.dumps({"Authorization": token}))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
