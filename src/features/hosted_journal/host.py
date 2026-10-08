import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from controllers.features import Features  # noqa: E402
from engine import runtime  # noqa: E402
from engine.record import Record  # noqa: E402
from features.hosted_journal.details import HostedJournalDetails  # noqa: E402
from features.hosted_journal.owner import Logins, MachineKeys, Owner, WrongTries  # noqa: E402
from features.hosted_journal.settings import GatewaySettings, keep_gateway_settings  # noqa: E402
from features.hosted_journal.vault import Vault  # noqa: E402
from resources.base import USER  # noqa: E402

WAITING = "No owner password yet. Get a one-time setup code with: docker compose exec -u gateway journal hosted-journal setup-code"
NOT_GATEWAY = "Only the login page's user reads its password and logins: run docker compose exec -u gateway journal hosted-journal {word}"


def record_of(root: Path) -> Record:
    import features
    features.load(root)
    return Record(root, runtime.env(root))


def prepare(root: Path, address: str, listen: str, port: int, proxy: str) -> str:
    """Switches the journal on a server on, at its address, with its login page run apart under a user of its own."""
    record = record_of(root)
    features = Features(record, actor=USER)
    features.switch(HostedJournalDetails.name, True)
    for key, value in (("address", address), ("listen", listen), ("port", str(port)), ("proxy", proxy), ("apart", "true")):
        features.configure(HostedJournalDetails.name, key, value)
    return ""


def gateway_settings(root: Path, address: str, proxy: str, days: int) -> str:
    """Keeps the login page's own settings where only its user can write them, so nothing in the record changes them."""
    keep_gateway_settings(root, GatewaySettings(address, proxy, days))
    return ""


def password_status(root: Path) -> str:
    return "" if Owner(Vault(root)).has_password() else WAITING


def setup_code(root: Path) -> str:
    owner = Owner(Vault(root))
    if owner.has_password():
        return "The owner's password is set. To choose a new one, run hosted-journal reset-password, then get a setup code."
    return f"Setup code, valid for one day: {owner.make_setup_code()}"


def reset_password(root: Path) -> str:
    vault = Vault(root)
    Owner(vault).forget_password()
    ended = Logins(vault).close_all()
    vault.audit("owner password reset", logins_ended=ended)
    return f"The owner's password is cleared and {ended} login(s) ended. Get a setup code to choose a new one."


def clear_tries(root: Path) -> str:
    vault = Vault(root)
    cleared = WrongTries(vault).clear()
    vault.audit("wrong tries cleared", count=cleared)
    return f"{cleared} wrong tries cleared: every place may log in again."


def machine_key(root: Path, name: str) -> str:
    vault = Vault(root)
    key = MachineKeys(vault).make(name)
    vault.audit("machine key made", name=name)
    return f"Machine key for {name}, shown only now: {key}\nOn that computer: journal environment connect --address <address> --key {key}, or give it in Settings, Connection to a server"


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
    prepared.add_argument("--proxy", default="")
    gateway = words.add_parser("gateway-settings", help="keep the login page's address, proxy and login days in its vault")
    gateway.add_argument("--address", required=True)
    gateway.add_argument("--proxy", default="")
    gateway.add_argument("--days", type=int, default=7)
    words.add_parser("password-status", help="say whether the owner still has to choose a password")
    words.add_parser("setup-code", help="make a one-time code that sets the owner's password")
    words.add_parser("reset-password", help="clear the owner's password and end every login")
    words.add_parser("logout-everywhere", help="end every login")
    words.add_parser("clear-tries", help="forget every wrong try, so a locked-out place may log in again")
    machine = words.add_parser("machine-key", help="make a key a copy of this journal syncs with")
    machine.add_argument("--name", required=True)
    given = parser.parse_args(argv)
    root = given.root.resolve()
    commands = {
        "prepare": lambda: prepare(root, given.address, given.listen, given.port, given.proxy),
        "gateway-settings": lambda: gateway_settings(root, given.address, given.proxy, given.days),
        "password-status": lambda: password_status(root),
        "setup-code": lambda: setup_code(root),
        "reset-password": lambda: reset_password(root),
        "logout-everywhere": lambda: log_out_everywhere(root),
        "clear-tries": lambda: clear_tries(root),
        "machine-key": lambda: machine_key(root, given.name),
    }
    try:
        text = commands[given.word]()
    except PermissionError as refused:
        raise SystemExit(NOT_GATEWAY.format(word=given.word)) from refused
    if text:
        print(text, flush=True)


if __name__ == "__main__":
    main(sys.argv[1:])
