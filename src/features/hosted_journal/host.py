import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from controllers.features import Features  # noqa: E402
from engine import runtime  # noqa: E402
from engine.record import Record  # noqa: E402
from features.hosted_journal.details import HostedJournalDetails  # noqa: E402
from features.hosted_journal.owner import Logins, Owner  # noqa: E402
from features.hosted_journal.vault import Vault  # noqa: E402
from resources.base import USER  # noqa: E402

WAITING = "No owner password yet. Get a one-time setup code with: docker compose exec journal hosted-journal setup-code"


def record_of(root: Path) -> Record:
    import features
    features.load(root)
    return Record(root, runtime.env(root))


def prepare(root: Path, address: str, listen: str, port: int) -> str:
    """Switches the journal on a server on, at its address, and says whether the owner still has to choose a password."""
    record = record_of(root)
    features = Features(record, actor=USER)
    features.switch(HostedJournalDetails.name, True)
    for key, value in (("address", address), ("listen", listen), ("port", str(port))):
        features.configure(HostedJournalDetails.name, key, value)
    return "" if Owner(Vault(root)).has_password() else WAITING


def setup_code(root: Path) -> str:
    owner = Owner(Vault(root))
    if owner.has_password():
        return "The owner's password is set. To choose a new one, run: hosted-journal reset-password, then get a setup code."
    return f"Setup code, valid for one day: {owner.make_setup_code()}"


def reset_password(root: Path) -> str:
    vault = Vault(root)
    Owner(vault).forget_password()
    ended = Logins(vault).close_all()
    vault.audit("owner password reset", logins_ended=ended)
    return f"The owner's password is cleared and {ended} login(s) ended. Get a setup code to choose a new one."


def log_out_everywhere(root: Path) -> str:
    vault = Vault(root)
    ended = Logins(vault).close_all()
    vault.audit("logged out everywhere", logins_ended=ended)
    return f"{ended} login(s) ended."


def main(argv: list[str]) -> None:
    parser = argparse.ArgumentParser(prog="hosted-journal", description="The journal on a server: setup and logins")
    parser.add_argument("--root", type=Path, required=True)
    words = parser.add_subparsers(dest="word", required=True)
    prepared = words.add_parser("prepare", help="switch the journal on a server on")
    prepared.add_argument("--address", default="")
    prepared.add_argument("--listen", default="0.0.0.0")
    prepared.add_argument("--port", type=int, default=8440)
    words.add_parser("setup-code", help="make a one-time code that sets the owner's password")
    words.add_parser("reset-password", help="clear the owner's password and end every login")
    words.add_parser("logout-everywhere", help="end every login")
    given = parser.parse_args(argv)
    root = given.root.resolve()
    text = {
        "prepare": lambda: prepare(root, given.address, given.listen, given.port),
        "setup-code": lambda: setup_code(root),
        "reset-password": lambda: reset_password(root),
        "logout-everywhere": lambda: log_out_everywhere(root),
    }[given.word]()
    if text:
        print(text, flush=True)


if __name__ == "__main__":
    main(sys.argv[1:])
