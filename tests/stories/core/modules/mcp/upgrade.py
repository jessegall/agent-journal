import json
from functools import partial

from tests.stories.engine.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.fixtures.version_four import SERVER_KEY, with_private_values

__all__ = ["private_folder"]


def test_version_4_servers_move_with_their_names_and_how_they_are_reached(new_story, private_folder):
    story = upgraded_story(new_story, partial(with_private_values, secrets_folder=private_folder))
    story.expect_text("mcp list", "github  ready  GitHub", "linear  signs in on its own  Linear")


def test_a_servers_key_moves_into_the_keys_file_outside_the_project_and_never_into_a_row(new_story, private_folder):
    story = upgraded_story(new_story, partial(with_private_values, secrets_folder=private_folder))
    keys = json.loads(next(private_folder.glob("*.keys.json")).read_text())
    story.expect_rows(keys == {"GITHUB_PERSONAL_ACCESS_TOKEN": SERVER_KEY}, SERVER_KEY.encode() not in story.home.database.read_bytes())
