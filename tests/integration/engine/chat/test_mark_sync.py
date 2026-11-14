from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.engine.chat.support.mark_faults import PATH


def refused(new_story, module: str, text: str) -> None:
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:{module}", text)


def test_two_third_party_buttons_cannot_share_a_line(journal):
    journal.expect_sync_success(f"{PATH}:GoodModule")
    journal.expect_sync_refusal(f"{PATH}:SharedLineModule", "good has a button that runs task edit, which shared also runs")
