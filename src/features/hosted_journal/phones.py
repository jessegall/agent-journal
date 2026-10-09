from features.hosted_journal.vault import Vault
from features.phone.guard import RecordGuard

PHONES = "phones.json"
SECRET = ("key", "code", "short", "passkey", "challenge", "unlock", "pending_passkey")
GUARDED = (*SECRET, "code_until", "expires", "tries", "days", "environment", "member", "journal")
INERT = {"key": "", "code": "", "short": "", "code_until": 0, "expires": 0, "tries": 0, "days": 0, "environment": "", "member": "", "journal": None,
         "passkey": {}, "challenge": {}, "unlock": {}, "pending_passkey": {}}
KEPT_ELSEWHERE = "kept by the login page"


class VaultGuard(RecordGuard):
    """A phone's keys, codes, expiry, Face ID state and environment in the login page's vault; its row keeps only a copy nothing trusts."""

    def __init__(self, vault: Vault) -> None:
        self.vault = vault

    def read(self, n: int) -> dict:
        return {**INERT, **self.vault.read(PHONES).get(str(n), {})}

    def kept(self, n: int, fields: dict) -> dict:
        guarded = {name: value for name, value in fields.items() if name in GUARDED}
        if guarded:
            with self.vault.held():
                phones = self.vault.read(PHONES)
                self.vault.write(PHONES, {**phones, str(n): {**phones.get(str(n), {}), **guarded}})
        shown = {name: value for name, value in fields.items() if name not in SECRET}
        if fields.get("key"):
            shown["key"] = KEPT_ELSEWHERE
        return shown

    def drop(self, n: int) -> None:
        self.vault.drop(PHONES, str(n))

    def drop_all(self) -> None:
        with self.vault.held():
            self.vault.write(PHONES, {})
