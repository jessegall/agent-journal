<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Reads;

use App\Messages\Commands\SendMessage\SendMessageCommand;
use Domain\Chat\Data\ChatRowsInput;
use Domain\Chat\Data\ChatRowsPageData;
use Domain\Chat\Exceptions\ChatUnavailable;
use Domain\Chat\Http\Loaders\ChatRowsLoader;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsRead;

/**
 * A chat's rows, read for a viewer in the chat, an admitted inbox member among them; a viewer not in it is refused.
 */
#[TestsRead(ChatRowsLoader::class)]
final class ChatRowsLoaderTest extends TestCase
{
    use CommitsHookRows;

    /**
     * None by name: a sent message commits under repeatable read, and what the test wrote is emptied when it ends.
     */
    protected const array TABLES = [];

    public function test_a_member_of_the_chat_reads_its_rows(): void
    {
        $this->journal->owner()->agent('Planner');

        $chat = $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Planner')
            ->pairChatOf('Owner', 'Planner');

        // A sent message reaches the chat's rows; a message row written by hand would not.
        $this->journal->runAs('Planner', new SendMessageCommand($chat->id, 'Ready.'));
        $this->journal->actAs('Owner');

        $page = $this->read($chat->id);

        $this->assertNotSame([], $page->toArray()['entries']);
    }

    public function test_an_admitted_inbox_member_in_the_chat_reads_its_rows(): void
    {
        $this->journal->owner()->user('Sam')->admitInboxMember('Sam');

        $chat = $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Sam')
            ->pairChatOf('Owner', 'Sam');

        $this->journal->actAsInboxMember('Sam');

        $this->assertInstanceOf(ChatRowsPageData::class, $this->read($chat->id));
    }

    public function test_a_viewer_not_in_the_chat_is_refused(): void
    {
        $this->journal->owner()->agent('Planner')->user('Kim');

        $chat = $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Planner')
            ->pairChatOf('Owner', 'Planner');

        $this->journal->actAs('Kim');

        $this->expectException(ChatUnavailable::class);

        $this->read($chat->id);
    }

    private function read(string $inboxId): ChatRowsPageData
    {
        return $this->app->make(ChatRowsLoader::class)(ChatRowsInput::validateAndCreate(['inboxId' => $inboxId]));
    }
}
