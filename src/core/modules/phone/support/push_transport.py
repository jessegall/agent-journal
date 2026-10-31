import urllib.error
import urllib.request

TIMEOUT_SECONDS = 10


class PushTransport:
    """The post of one empty push to a push service: its status, or 0 when the service could not be reached."""

    def post(self, endpoint: str, headers: dict[str, str]) -> int:
        try:
            with urllib.request.urlopen(urllib.request.Request(endpoint, data=b"", headers=headers, method="POST"), timeout=TIMEOUT_SECONDS) as answer:
                return answer.status
        except urllib.error.HTTPError as refused:
            return refused.code
        except (urllib.error.URLError, OSError):
            return 0
