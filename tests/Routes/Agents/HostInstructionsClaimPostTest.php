<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Hosts\Commands\ClaimHostInstructions\ClaimHostInstructionsCommand;
use App\Hosts\Values\HostInstructionClaim;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host's long poll takes the instructions waiting for it.
 */
#[TestsRoute('POST', 'agents.host.instructions.claim')]
final class HostInstructionsClaimPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload(['limit' => 5, 'wait' => 0])
            ->reply(ClaimHostInstructionsCommand::class, new HostInstructionClaim([], '2026-11-26T10:00:00.000Z', null, 600))
            ->expects(ClaimHostInstructionsCommand::class, ['hostId' => $host->hostId, 'limit' => 5]);
    }
}
