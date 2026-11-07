from core.base.query.queries import Queries
from core.modules.messages.models.chat_message import ChatMessage
from tests.stories.core.modules.templates.support.sending_templates import SendingTemplates

PLAN_CRITIQUE = 'template send 1 --on=plan:1 --set=agents="2 agents" --set=size="a normal read" --environment main'


def chat_rows(story) -> list[tuple[str, str]]:
    return [(message.commented_row, message.type) for message in story.container.get(Queries).query(ChatMessage).oldest().all_rows()]


def test_a_plan_comment_a_document_comment_and_a_critique_request_are_in_the_chat_with_their_rows(new_story):
    story = new_story(fixture=SendingTemplates)
    story.run('doc make "Cart rules" --abstract "How the cart counts money" --body "in cents"', actor=story.user)
    story.expect_success('plan comment 1 "Split phase one" --environment main', actor=story.user)
    story.expect_success('doc comment 1 "Use cents everywhere" --environment main', actor=story.user)
    story.expect_success(PLAN_CRITIQUE, actor=story.user)
    story.expect_rows([row for row, _ in chat_rows(story)] == ["plan:1", "doc:1", "plan:1"])
    story.expect_text("message list --environment 1 --oldest", "Split phase one", "Use cents everywhere", "Please have 2 agents give plan 1 a normal read")
