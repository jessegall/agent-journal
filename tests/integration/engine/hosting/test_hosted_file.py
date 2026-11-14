from engine.hosting.hosted_file import HostedFile
from engine.hosting.hosting import Hosting
from tests.stories.support.story_checks import expect_value

HOSTED_TEXT = """public_origin = "https://journal.example.com"
agent_user = "journal-agent"
proxy_user = "caddy"
idle_minutes = 60
absolute_hours = 24
recent_login_minutes = 5
allow_app_codes = true
"""


def hosted_file(tmp_path, text):
    path = tmp_path / "hosted.toml"
    path.write_text(text)
    return HostedFile(path)


def test_a_story_container_is_local_whatever_file_the_machine_holds(journal):
    expect_value(journal.container.get(Hosting), Hosting.local())
