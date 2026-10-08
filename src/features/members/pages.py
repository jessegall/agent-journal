import html

from features.hosted_journal.pages import Notice, framed

BELOW_LOGIN = '<p class="abstract">Did the owner invite you? <a href="/member">Log in with your name</a>.</p>'


def join_page(project: str, name: str, code: str, notice: Notice) -> str:
    return framed(f"Join {project}", f"""<h1>Join {html.escape(project)}</h1>
<p class="abstract">The owner invited you as {html.escape(name)}. Choose a password to log in with from now on.</p>
<form method="post" action="/join">{notice.shown()}
<input type="hidden" name="code" value="{html.escape(code)}">
<label>Password<input type="password" name="password" autocomplete="new-password" minlength="12" required autofocus></label>
<label>Password again<input type="password" name="again" autocomplete="new-password" minlength="12" required></label>
<button type="submit">Join</button></form>""")


def member_login_page(project: str, notice: Notice) -> str:
    return framed(f"Log in to {project}", f"""<h1>Log in to {html.escape(project)}</h1>
<p class="abstract">Log in with the name the owner invited you by and the password you chose.</p>
<form method="post" action="/member">{notice.shown()}
<label>Name<input name="name" autocomplete="username" required autofocus></label>
<label>Password<input type="password" name="password" autocomplete="current-password" required></label>
<button type="submit">Log in</button></form>
<p class="abstract"><a href="/login">Log in as the owner</a></p>""")
