import json
import os
import re
import subprocess
import time
from urllib.parse import parse_qs, urlsplit

from controllers.features import Features
from features.hosted_journal.owner import Logins
from features.hosted_journal.test import SCENARIOS_WAIT, WEB, Answer, Hosted, hosted  # noqa: F401  hosted is the fixture
from features.hosted_journal.vault import Vault
from features.members.details import MembersDetails
from features.members.roles import NOT_A_WRITER, Role
from features.members.roster import INVITE_DAYS, Roster
from features.trigger import DAY
from resources.base import USER

MEMBER_PASSWORD = "a member's own password"


def with_members(hosted: Hosted) -> str:
    Features(hosted.record, actor=USER).switch(MembersDetails.name, True)
    return f"__Host-journal={hosted.logged_in()}"


def sent(hosted: Hosted, path: str, body: dict, cookie: str) -> Answer:
    return hosted.call("POST", path, body=json.dumps(body), Cookie=cookie, Origin=f"http://127.0.0.1:{hosted.port}", Content_Type="application/json")


def member_login(hosted: Hosted, name: str, role: Role) -> str:
    roster = Roster(hosted.vault)
    member = roster.join(roster.invite(name, role).code, MEMBER_PASSWORD)
    return f"__Host-journal={Logins(hosted.vault).open(7, 'test', member.id)}"


def login_in(answer: Answer) -> str:
    return re.search(r"__Host-journal=([^;]+)", answer.headers["set-cookie"]).group(1)


def test_an_invited_person_joins_once_from_the_link_and_logs_in_again_by_name(hosted):
    owner = with_members(hosted)
    made = sent(hosted, "/api/hosting/members", {"name": "  Ada  Lovelace "}, owner)
    link = urlsplit(json.loads(made.text)["link"])
    code = parse_qs(link.query)["code"][0]
    assert made.status == 201 and link.path == "/join"
    assert sent(hosted, "/api/hosting/members", {"name": "ada lovelace"}, owner).status == 400, "two members never share a name"
    assert "invited you as Ada Lovelace" in hosted.call("GET", f"/join?code={code}").text
    assert hosted.call("GET", "/join?code=guessed").status == 404, "a guessed code shows no invite"
    assert hosted.call("POST", "/join", {"code": code, "password": "short", "again": "short"}).status == 400
    joined = hosted.call("POST", "/join", {"code": code, "password": MEMBER_PASSWORD, "again": MEMBER_PASSWORD})
    member = Roster(hosted.vault).named("Ada Lovelace")
    assert joined.status == 303 and joined.headers["location"] == "/" and member.has_joined()
    assert Logins(hosted.vault).found(login_in(joined)).member == member.id, "joining is the member's first login"
    assert hosted.call("POST", "/join", {"code": code, "password": MEMBER_PASSWORD, "again": MEMBER_PASSWORD}).status == 401, "the link works once"
    theirs = f"__Host-journal={login_in(joined)}"
    assert json.loads(hosted.call("GET", "/api/hosting/me", Cookie=theirs).text) == {"member": member.id, "name": "Ada Lovelace", "owner": False}
    assert [sent(hosted, "/api/hosting/members", {"name": "Eve"}, theirs).status, hosted.call("GET", "/api/hosting", Cookie=theirs).status] == [403, 403], \
        "a member invites no one and reaches none of the owner's server actions"
    assert "Log in with your name" in hosted.call("GET", "/login").text
    again = hosted.call("POST", "/member", {"name": "ada lovelace", "password": MEMBER_PASSWORD})
    assert again.status == 303 and Logins(hosted.vault).found(login_in(again)).member == member.id
    assert hosted.call("POST", "/member", {"name": "Ada Lovelace", "password": "not the member's password"}).status == 401
    later = parse_qs(urlsplit(json.loads(sent(hosted, "/api/hosting/members", {"name": "Bea"}, owner).text)["link"]).query)["code"][0]
    week_on = Vault(hosted.record.root, clock=lambda: time.time() + INVITE_DAYS * DAY + 1)
    assert Roster(week_on).invited_by(later) is None and Roster(hosted.vault).invited_by(later).name == "Bea", "an invite runs out after a week"


def test_inviting_joining_logging_in_and_a_readers_refusal_work_in_a_browser(hosted):
    owner = with_members(hosted)
    invite = json.loads(sent(hosted, "/api/hosting/members", {"name": "Bea"}, owner).text)["link"]
    roster = Roster(hosted.vault)
    roster.join(roster.invite("Dan", Role.WRITER).code, MEMBER_PASSWORD)
    reader = member_login(hosted, "Cleo", Role.READER).split("=", 1)[1]
    env = {**os.environ, "HOSTED_URL": f"http://127.0.0.1:{hosted.port}/", "HOSTED_OWNER_LOGIN": owner.split("=", 1)[1], "HOSTED_READER_LOGIN": reader,
           "HOSTED_INVITE_LINK": invite.replace("https://", "http://"), "HOSTED_MEMBER_NAME": "Dan", "HOSTED_MEMBER_PASSWORD": MEMBER_PASSWORD}
    run = subprocess.run(["node", "browser/hosted/members.mjs"], cwd=WEB, env=env, capture_output=True, text=True, timeout=SCENARIOS_WAIT)
    assert run.returncode == 0, run.stderr[-2000:]
    assert json.loads(run.stdout.strip().splitlines()[-1]) == {}


def test_a_reader_only_reads_a_writer_writes_shared_rows_and_a_refusal_says_why(hosted):
    owner = with_members(hosted)
    reader, writer = member_login(hosted, "Ada", Role.READER), member_login(hosted, "Bea", Role.WRITER)
    todo = f"/api/{hosted.record.env}/todo"
    refused = sent(hosted, todo, {"title": "From a reader"}, reader)
    assert refused.status == 403 and json.loads(refused.text) == {"error": Role.READER.refusal(), "blocked": True}
    assert sent(hosted, todo, {"title": "From a writer"}, writer).status == 201
    ran = sent(hosted, f"/api/{hosted.record.env}/tool/1/run", {}, writer)
    assert ran.status == 403 and json.loads(ran.text)["error"] == Role.WRITER.refusal(), "a writer runs nothing"
    assert json.loads(sent(hosted, "/api/hosting/members", {"name": "Eve"}, writer).text) == {"error": "Only the owner can do this.", "blocked": True}
    told = json.loads(hosted.call("GET", "/api/hosting/me", Cookie=reader).text)
    assert told["role"] == "reader" and told["abilities"]["cannot"][0]["why"] == NOT_A_WRITER, "a member is told what they can do and why not the rest"
    ada = Roster(hosted.vault).named("Ada").id
    assert sent(hosted, "/api/hosting/members/role", {"member": ada, "role": "owner"}, owner).status == 400, "there are two roles"
    assert sent(hosted, "/api/hosting/members/role", {"member": ada, "role": "writer"}, owner).status == 200
    assert sent(hosted, todo, {"title": "Now a writer"}, reader).status == 201, "a new role holds from the next press"
