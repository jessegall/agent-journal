import html
from enum import Enum

from features.sharing.page import STYLE

FORM_STYLE = """
main { max-width: 400px; padding-top: 18vh; }
form { display: grid; gap: 14px; margin-top: 24px; }
label { display: grid; gap: 6px; font-size: 14px; color: var(--muted); }
input { padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--bg); color: var(--text); font: inherit; }
button { padding: 10px 14px; border: 0; border-radius: 8px; background: var(--accent); color: var(--bg); font: inherit; font-weight: 600; cursor: pointer; }
p.notice { margin: 0; padding: 10px 12px; border-radius: 8px; background: var(--code); font-size: 14px; }
"""


class Notice(Enum):
    """What the login page tells the person in front of it, picked by the page's address."""

    NONE = ""
    WRONG = "That password is wrong."
    WRONG_CODE = "That setup code is wrong or has run out."
    RAN_OUT = "Your login ran out. Log in again."
    LOGGED_OUT = "You are logged out."
    SHORT = "The password needs at least 12 characters, typed the same twice."
    WRONG_NAME = "That name or password is wrong."
    LEFT = "You left this journal. Your words stay in it under your name."
    WRONG_INVITE = "This invite link is wrong, was used already or has run out. Ask the owner for a new one."

    @classmethod
    def named(cls, name: str) -> "Notice":
        return cls.__members__.get(name.upper().replace("-", "_"), cls.NONE)

    def shown(self) -> str:
        return f'<p class="notice" role="alert">{html.escape(self.value)}</p>' if self.value else ""


def framed(title: str, body: str) -> str:
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>{html.escape(title)}</title><style>{STYLE}{FORM_STYLE}</style></head>
<body><main>{body}</main></body></html>"""


def login_page(project: str, notice: Notice, below: str) -> str:
    return framed(f"Log in to {project}", f"""<h1>Log in to {html.escape(project)}</h1>
<p class="abstract">This journal runs on a server. Its owner's password opens it.</p>
<form method="post" action="/login">{notice.shown()}
<label>Password<input type="password" name="password" autocomplete="current-password" required autofocus></label>
<button type="submit">Log in</button></form>{below}""")


def notice_page(project: str, text: str) -> str:
    return framed(f"Log in to {project}", f"""<h1>Log in to {html.escape(project)}</h1>
<p class="notice" role="alert">{html.escape(text)}</p>""")


def locked_page(project: str, seconds: float) -> str:
    minutes = max(1, round(seconds / 60))
    return notice_page(project, f"Too many wrong tries. Try again in {minutes} minute{'' if minutes == 1 else 's'}.")


def insecure_page(project: str) -> str:
    return notice_page(project, "This journal answers only over https. Open it at its https address.")


def taken_down_page(project: str) -> str:
    return notice_page(project, "This journal was taken down. Its owner can bring it back from the server.")


def setup_page(project: str, notice: Notice) -> str:
    return framed(f"Set up {project}", f"""<h1>Set up {html.escape(project)}</h1>
<p class="abstract">Choose the owner's password. The setup code comes from the server: run
<code>docker compose exec journal hosted-journal setup-code</code> there.</p>
<form method="post" action="/setup">{notice.shown()}
<label>Setup code<input name="code" autocomplete="one-time-code" required autofocus></label>
<label>Password<input type="password" name="password" autocomplete="new-password" minlength="12" required></label>
<label>Password again<input type="password" name="again" autocomplete="new-password" minlength="12" required></label>
<button type="submit">Set the password</button></form>""")
