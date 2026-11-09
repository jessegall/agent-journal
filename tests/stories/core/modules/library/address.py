from tests.stories.core.support.coding_fixtures import UserBuilder

ADDRESS = "journal.core.library.address"


def test_an_agent_cannot_reset_the_address_a_person_set(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {ADDRESS} 10.0.0.5 --project", actor=story.user)
    story.expect_refusal(f"setting set {ADDRESS} evil.example.com --project --reason needed", "A person was asked in the dock", actor=story.agent)
    story.expect_text(f"setting show {ADDRESS}", "10.0.0.5", actor=story.user)
