from tests.stories.core.support.coding_fixtures import BuilderWithUser

ADDRESS = "journal.core.library.address"


def test_a_person_sets_the_address_of_the_shared_server(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {ADDRESS} 10.0.0.5 --project", actor=story.user)
    story.expect_text(f"setting show {ADDRESS}", "10.0.0.5", actor=story.user)


def test_an_agent_cannot_set_the_address_of_the_shared_server(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal(f"setting set {ADDRESS} evil.example.com --project", "only a person changes the address of the shared server", actor=story.agent)


def test_an_agent_cannot_reset_the_address_a_person_set(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {ADDRESS} 10.0.0.5 --project", actor=story.user)
    story.expect_refusal(f"setting set {ADDRESS} evil.example.com --project", "only a person changes the address of the shared server", actor=story.agent)
    story.expect_text(f"setting show {ADDRESS}", "10.0.0.5", actor=story.user)
