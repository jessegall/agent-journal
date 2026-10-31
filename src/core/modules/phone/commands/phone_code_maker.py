import hashlib
import secrets

CODE_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ"
HALF_LETTERS = 4
PAIRING_PATH = "/pair#code="


class PhoneCodeMaker:
    """Makes pairing codes such as ABCD-EFGH, without the letters I and O that read as numbers, and the digest a
    code and a session token are kept by."""

    def code(self) -> str:
        letters = "".join(secrets.choice(CODE_LETTERS) for _ in range(HALF_LETTERS * 2))
        return f"{letters[:HALF_LETTERS]}-{letters[HALF_LETTERS:]}"

    def digest(self, text: str) -> str:
        return hashlib.sha256(text.strip().upper().encode()).hexdigest()

    def link(self, code: str) -> str:
        return f"{PAIRING_PATH}{code}"
