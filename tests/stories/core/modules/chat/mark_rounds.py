from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.query.queries import Queries
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.chat.models.enums.chat_mark_state import ChatMarkState
from tests.stories.core.modules.chat.support.mark_samples import SampleMarkType
from tests.stories.core.modules.chat.support.round_marks import KEY, PATH
from tests.stories.core.support.fixtures import OpenTask, UserJoined


def test_an_expected_listener_refusal_is_logged_once_without_an_exception_mark(new_story):
    story = new_story(PATH, fixture=UserJoined)
    story.expect_success('task make "Refused mark source" --environment main', actor=story.agent)

    for _ in range(3):
        story.run_listeners()

    story.expect_rows(not story.container.get(Queries).query(ChatMark).filter(type="chat.exception").exists())
    story.expect_rows(story.system_log_text().count("listener chatsample.refused-mark refused event") == 1)
    story.expect_rows(not story.container.get(Database).rows(Statement("SELECT * FROM listener_skips WHERE listener = 'chatsample.refused-mark'")))


def test_one_listener_key_follows_a_mark_that_ends_and_comes_back(new_story):
    story = new_story(PATH, fixture=OpenTask)
    story.run_listeners()
    first = story.container.get(Queries).query(ChatMark).filter(key=KEY).first()
    story.expect_rows(first.state is ChatMarkState.SHOWN)
    story.expect_success("task start 1", actor=story.agent)
    story.expect_success('task close 1 --outcome "Done"', actor=story.agent)
    story.run_listeners()
    story.expect_rows(story.row(ChatMark, first.id).state is ChatMarkState.ENDED)

    story.expect_success("task reopen 1", actor=story.agent)
    story.run_listeners()

    marks = list(story.container.get(Queries).query(ChatMark).filter(type=SampleMarkType.PROCESS.value).oldest().all_rows())
    story.expect_rows(len(marks) == 2)
    story.expect_rows(marks[0].id == first.id, marks[0].state is ChatMarkState.ENDED,
                      marks[1].key.startswith(KEY), marks[1].key != KEY, marks[1].state is ChatMarkState.SHOWN)
    story.expect_rows(not story.container.get(Queries).query(ChatMark).filter(type="chat.exception").exists())
