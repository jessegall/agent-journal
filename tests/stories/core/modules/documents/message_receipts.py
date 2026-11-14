import json
from unittest.mock import patch

from engine.command.bus import Bus
from engine.database.database import Database
from core.modules.documents.commands.record_subject_link.record_subject_link import RecordSubjectLink
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value


def test_the_links_of_several_messages_are_read_with_one_line(new_story):
    story = new_story(fixture=UserJoined)
    target = story.new_row_id('task make "Fix the cart" --environment main')
    first = story.new_row_id(f'message send "Look at task {target}" --environment main')
    second = story.new_row_id('message send "A plain message" --environment main')
    story.run_listeners()
    receipts = json.loads(story.run(f"link receipts --messages {first},{second} --json").output_text)["messages"]
    story.expect_rows(set(receipts) == {str(first), str(second)}, all(set(receipt) == {"named", "sent"} for receipt in receipts.values()))
    labelled = json.loads(story.run(f"link list --source message:{first} --type about --type edited --group-counterparts --page-size 10 --json").output_text)
    story.expect_rows(receipts[str(first)]["named"]["total"] == labelled["total"], receipts[str(second)]["named"]["total"] == 0,
                      receipts[str(first)]["sent"]["total"] == receipts[str(second)]["sent"]["total"])


def test_a_line_names_between_one_and_fifty_messages(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal(f"link receipts --messages {','.join(str(number) for number in range(1, 52))}", "name between 1 and 50 messages")


def test_several_messages_naming_one_task_read_that_task_once(new_story):
    story = new_story(fixture=UserJoined)
    target = story.new_row_id('task make "Fix the cart" --environment main')
    numbers = [story.new_row_id(f'message send "Look again {number}" --environment main') for number in range(3)]
    for number in numbers:
        story.container.get(Bus).run(RecordSubjectLink(number, "task", target), story.agent, environment_id=1)
    database = story.container.get(Database)
    with patch.object(database, "rows", wraps=database.rows) as reads:
        outcome = story.run(f"link receipts --messages {','.join(str(number) for number in numbers)} --json")
    receipts = json.loads(outcome.output_text)["messages"]
    task_reads = [call for call in reads.call_args_list if "FROM tasks " in call.args[0].sql]
    story.expect_rows(all(receipts[str(number)]["named"]["total"] == 1 for number in numbers))
    expect_value(len(task_reads), 1)
