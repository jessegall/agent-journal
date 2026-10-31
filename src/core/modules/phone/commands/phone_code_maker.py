import secrets

from core.modules.phone.support.text_digest import TextDigest

CODE_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ"
HALF_LETTERS = 4
PAIRING_PATH = "/pair#code="


class PhoneCodeMaker:
    """Makes pairing codes such as ABCD-EFGH, without the letters I and O that read as numbers, and the digest
    a code is kept by, of the code as typed in any case."""

    def code(self) -> str:
        letters = "".join(secrets.choice(CODE_LETTERS) for _ in range(HALF_LETTERS * 2))
        return f"{letters[:HALF_LETTERS]}-{letters[HALF_LETTERS:]}"

    def digest(self, text: str) -> str:
        return TextDigest().of(text.strip().upper())

    def link(self, code: str) -> str:
        return f"{PAIRING_PATH}{code}"
