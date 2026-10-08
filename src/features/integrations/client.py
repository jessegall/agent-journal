import json
import urllib.error
import urllib.request
from urllib.parse import urlsplit

from features.secrets.running import Masker
from features.secrets.values import ValuesFile
from resources.base import Refused

TIMEOUT = 10.0


class NoRedirects(urllib.request.HTTPRedirectHandler):
    """A redirect is an error, so the key in the request header never follows it to another address."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


OPENER = urllib.request.build_opener(NoRedirects)


class IntegrationClient:
    """Talks to one service from the journal's own process: the key is read here, sent only to that service's host and never leaves through a command line, a subprocess or an error."""

    def __init__(self, root, host: str, variable: str, timeout: float = TIMEOUT):
        self.host, self.timeout, self.variable, self.values = host, timeout, variable, ValuesFile(root)
        self.read_key()

    def read_key(self) -> None:
        self.key = self.values.values().get(self.variable, "") if self.variable else ""
        self.masker = Masker({self.key: self.variable} if self.key else {})
        self.seen = self.stamp()

    def stamp(self) -> int:
        return self.values.path.stat().st_mtime_ns if self.values.path.is_file() else 0

    def current(self) -> None:
        """A key you replaced in your secrets is read again; the file is looked at only by its time."""
        if self.stamp() != self.seen:
            self.read_key()

    def masked(self, text: str) -> str:
        return self.masker.masked(text.encode()).decode(errors="replace")

    def post(self, url: str, body: dict) -> str:
        """The service's answer as text, for the caller to read into its own typed values."""
        self.current()
        address = urlsplit(url)
        if address.scheme != "https" or address.hostname != self.host:
            raise Refused(f"this integration sends its key only to https://{self.host}, not to {self.masked(url)}")
        if not self.key:
            raise Refused("no key is picked, so nothing is sent")
        request = urllib.request.Request(url, data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "Authorization": self.key})
        try:
            with OPENER.open(request, timeout=self.timeout) as answer:
                return answer.read().decode()
        except urllib.error.HTTPError as error:
            raise Refused(self.masked(f"{self.host} answered {error.code}")) from None
        except OSError as error:
            raise Refused(self.masked(f"could not reach {self.host}: {error}")) from None
