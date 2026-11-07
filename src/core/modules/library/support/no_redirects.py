import urllib.request


class NoRedirects(urllib.request.HTTPRedirectHandler):
    """Follows no redirect, since urllib would carry the token to wherever the answer points."""

    def redirect_request(self, *details: object) -> None:
        return None
