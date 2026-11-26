<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Commands\Sessions\ReleaseAgentHold\ReleaseAgentHoldCommand;
use App\Enums\Drivers\HoldReason;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner releases the hold that keeps an agent's session waiting.
 */
#[TestsRoute('POST', 'web.release-runtime-hold')]
final class ReleaseRuntimeHoldPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Main');

        return RouteCall::as(Caller::User)
            ->parameters([
                'session' => $start->session->id,
            ])
            ->payload([
                'reason' => 'The input arrived.',
                'agentId' => $start->agent->id,
                'hold' => 'user_input',
            ])
            ->expects(ReleaseAgentHoldCommand::class, [
                'agentId' => $start->agent->id,
                'sessionId' => $start->session->id,
                'expectedHold' => HoldReason::UserInput,
                'reason' => 'The input arrived.',
            ]);
    }
}
