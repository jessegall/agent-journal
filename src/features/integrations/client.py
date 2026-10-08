import json
import urllib.error
import urllib.request
from urllib.parse import urlsplit

from features.secrets.running import Masker
from features.secrets.values import ValuesFile
from resources.base import Refused

TIMEOUT = 10.0


class IntegrationClient:
    """Talks to one service from the journal's own process: the key is read here, sent only to that service's host and never leaves through a command line, a subprocess or an error."""

    def __init__(self, root, host: str, variable: str, timeout: float = TIMEOUT):
        self.host, self.timeout = host, timeout
        self.key = ValuesFile(root).values().get(variable, "") if variable else ""
        self.masker = Masker({self.key: variable} if self.key else {})

    def masked(self, text: str) -> str:
        return (self.masker.masked(text.encode())).decode(errors="replace")

    def post(self, url: str, body: dict) -> str:
        """The service's answer as text, for the caller to read into its own typed values."""
        if urlsplit(url).scheme != "https" or urlsplit(url).hostname != self.host:
            raise Refused(f"this integration sends its key only to https://{self.host}, not to {self.masked(url)}")
        if not self.key:
            raise Refused("no key is picked, so nothing is sent")
        request = urllib.request.Request(url, data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "Authorization": self.key})
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as answer:
                return answer.read().decode()
        except urllib.error.HTTPError as error:
            raise Refused(self.masked(f"{self.host} answered {error.code}")) from None
        except OSError as error:
            raise Refused(self.masked(f"could not reach {self.host}: {error}")) from None
