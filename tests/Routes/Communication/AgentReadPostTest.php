<?php

declare(strict_types=1);

namespace Tests\Routes\Communication;

use App\Messages\Commands\ReadMessage\ReadMessageCommand;
use App\Messages\ShownMessage;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads one message by its id.
 */
#[TestsRoute('POST', 'communication.agent.read')]
final class AgentReadPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $inbox = $journal->inboxCalled('Owner');
        $messageId = (string) Str::ulid();

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'message_id' => $messageId,
                'request_key' => 'read-1',
            ])
            ->reply(ReadMessageCommand::class, new ShownMessage(
                $messageId,
                $inbox->id,
                'user',
                $journal->ownerUser()->id,
                'Hello',
                1,
                null,
                '2026-11-26T10:00:00+00:00',
            ))
            ->expects(ReadMessageCommand::class, [
                'messageId' => $messageId,
            ]);
    }
}
