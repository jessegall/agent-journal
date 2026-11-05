import base64
import json
import urllib.parse
from collections.abc import Mapping


class OutputMask:
    """Values hidden in what a program printed, in every form a program prints a value in: as it is, in
    base64, URL-quoted, JSON-escaped and in hex, the longest form first."""

    def __init__(self, values: Mapping[str, str]) -> None:
        pairs = ((form, f"[secret {variable}]".encode()) for value, variable in values.items() for form in self.forms(value))
        self.masks = sorted(pairs, key=lambda pair: len(pair[0]), reverse=True)

    @staticmethod
    def forms(value: str) -> set[bytes]:
        raw = value.encode()
        forms = {raw, base64.b64encode(raw), base64.urlsafe_b64encode(raw), urllib.parse.quote(value, safe="").encode(), json.dumps(value)[1:-1].encode(), raw.hex().encode()}
        return {form.rstrip(b"=") for form in forms if form.rstrip(b"=")}

    def masked(self, output: bytes) -> bytes:
        for form, mask in self.masks:
            output = output.replace(form, mask)
        return output
