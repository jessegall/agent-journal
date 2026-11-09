import json

from tests.stories.core.support.fixtures import UserJoined


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
