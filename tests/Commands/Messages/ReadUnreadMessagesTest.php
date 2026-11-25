<?php

declare(strict_types=1);

namespace Tests\Commands\Messages;

use App\Commands\Messages\ReadUnreadMessages\ReadUnreadMessagesCommand;
use Tests\Support\CommitsHookRows;
use Tests\Support\Seeding\SeedsJournal;
use Tests\TestCase;

/**
 * A member reads every message it has not read yet, oldest first, and a second read finds none.
 */
final class ReadUnreadMessagesTest extends TestCase
{
    use CommitsHookRows;
    use SeedsJournal;

    private const array TABLES = ['messages', 'message_reads'];

    public function test_the_unread_messages_are_read_once(): void
    {
        $this->journal()->owner()->agent('Planner')->chat('Owner', 'Planner');
        $chat = $this->journal()->chatOf('Owner', 'Planner');
        $this->journal()->post('Owner', $chat, 'Start the build.');
        $this->journal()->post('Owner', $chat, 'Then the tests.');

        $first = $this->journal()->actAs('Planner')->run(new ReadUnreadMessagesCommand());
        $second = $this->journal()->run(new ReadUnreadMessagesCommand());

        $this->assertSame(['Start the build.', 'Then the tests.'], array_map(fn ($shown) => $shown->body, $first->messages));
        $this->assertSame([], $second->messages);
    }
}
