import base64
import json
import urllib.parse


class OutputMask:
    """A secret's values hidden in what a program printed, in every form a program prints a value in: as it is, in base64, URL-quoted, JSON-escaped and in hex."""

    def __init__(self, masks: dict[str, str]) -> None:
        self.masks = sorted(((form, f"[secret {name}]".encode()) for value, name in masks.items() for form in self.forms(value)), key=lambda pair: len(pair[0]), reverse=True)

    @staticmethod
    def forms(value: str) -> set[bytes]:
        raw = value.encode()
        found = {raw, base64.b64encode(raw), base64.urlsafe_b64encode(raw), urllib.parse.quote(value, safe="").encode(), json.dumps(value)[1:-1].encode(), raw.hex().encode()}
        return {form.rstrip(b"=") for form in found if form}

    def masked(self, output: bytes) -> bytes:
        for form, mask in self.masks:
            output = output.replace(form, mask)
        return output
