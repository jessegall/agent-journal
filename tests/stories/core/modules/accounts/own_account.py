import pytest

from tests.stories.core.support.fixtures import UserJoined


@pytest.mark.xfail(strict=True, reason="no command shows an account: the accounts module has tables and a guard only")
def test_a_person_sees_their_own_account_with_name_and_role(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text("account show", "role", actor=story.user)
