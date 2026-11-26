<?php

declare(strict_types=1);

namespace Tests\Routes\Communication;

use App\Messages\Commands\SendMessage\SendMessageCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent sends a message to the owner's inbox.
 */
#[TestsRoute('POST', 'communication.agent.send')]
final class AgentSendPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $inbox = $journal->inboxCalled('Owner');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'message' => [
                    'inbox_id' => $inbox->id,
                    'body' => 'Hello',
                ],
                'request_key' => 'send-1',
            ])
            ->reply(SendMessageCommand::class, (string) Str::ulid())
            ->expects(SendMessageCommand::class, [
                'inboxId' => $inbox->id,
                'body' => 'Hello',
            ]);
    }
}
