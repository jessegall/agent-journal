<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use Domain\Chat\ChatDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The chat page sends a message to one of the user's chats, with the payload the page records.
 */
#[TestsRoute('POST', 'chat.send')]
final class SendPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $inbox = $journal->owner()->inboxCalled('Owner');

        return RouteCall::recorded('chat-send', ['01JPAGEREQUESTINBOX0000000' => $inbox->id])
            ->expects(SendMessageCommand::class, [
                'inboxId' => $inbox->id,
                'body' => 'Hello',
            ]);
    }
}
