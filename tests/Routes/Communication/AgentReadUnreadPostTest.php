<?php

declare(strict_types=1);

namespace Tests\Routes\Communication;

use App\Messages\Commands\ReadUnreadMessages\ReadUnreadMessagesCommand;
use App\Messages\ShownMessages;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads every message it has not read yet.
 */
#[TestsRoute('POST', 'communication.agent.read-unread')]
final class AgentReadUnreadPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        return RouteCall::as(Caller::Agent, $journal->owner()->signedStart('Writer'))
            ->payload([
                'request_key' => 'read-unread-1',
            ])
            ->reply(ReadUnreadMessagesCommand::class, new ShownMessages([]))
            ->expects(ReadUnreadMessagesCommand::class);
    }
}
