<?php

declare(strict_types=1);

namespace Tests\Routes\Communication;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A signed-in user sends a message to their own inbox.
 */
#[TestsRoute('POST', 'communication.send')]
final class SendPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $inbox = $journal->owner()->inboxCalled('Owner');

        return RouteCall::as(Caller::User)
            ->payload([
                'inboxId' => $inbox->id,
                'body' => 'Hello',
                'request_key' => 'send-1',
            ])
            ->reply(SendMessageCommand::class, (string) Str::ulid())
            ->expects(SendMessageCommand::class, [
                'inboxId' => $inbox->id,
                'body' => 'Hello',
            ]);
    }
}
