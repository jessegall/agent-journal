from http.cookies import SimpleCookie

COOKIE = "journal_session"
LIFETIME_SECONDS = 30 * 86400
HTTPS = "https"


class SessionCookie:
    """The cookie that carries a browser's session on a hosted journal: its key read from a request's Cookie header, and the Set-Cookie value written HttpOnly and SameSite=Lax, Secure when the request came over HTTPS."""

    @staticmethod
    def key(cookie: str) -> str:
        morsel = SimpleCookie(cookie).get(COOKIE)
        return morsel.value if morsel else ""

    @staticmethod
    def value(key: str, protocol: str) -> str:
        return f"{COOKIE}={key}; Max-Age={LIFETIME_SECONDS}; Path=/; HttpOnly; SameSite=Lax{SessionCookie.secure(protocol)}"

    @staticmethod
    def expired_value(protocol: str) -> str:
        return f"{COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax{SessionCookie.secure(protocol)}"

    @staticmethod
    def secure(protocol: str) -> str:
        return "; Secure" if protocol == HTTPS else ""
