"""How the journal opens a service's address from its own process: a redirect is never followed, so a key in a header never leaves for another address."""

import urllib.request

TIMEOUT = 10.0


class NoRedirects(urllib.request.HTTPRedirectHandler):
    """A redirect is an error, so the key in the request header never follows it to another address."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


OPENER = urllib.request.build_opener(NoRedirects)
