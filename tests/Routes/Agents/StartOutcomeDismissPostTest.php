<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Sessions\Commands\DismissSessionStartOutcome\DismissSessionStartOutcomeCommand;
use App\Sessions\Enums\StartDisposition;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner dismisses the outcome of a session start they saw.
 */
#[TestsRoute('POST', 'agents.start-outcome.dismiss')]
final class StartOutcomeDismissPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Main');
        $requestId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->parameters([
                'agent' => $start->agent->id,
            ])
            ->payload([
                'requestId' => $requestId,
                'version' => 'refused',
            ])
            ->expects(DismissSessionStartOutcomeCommand::class, [
                'agentId' => $start->agent->id,
                'requestId' => $requestId,
                'version' => StartDisposition::Refused,
            ]);
    }
}
