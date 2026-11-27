<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Hosts\Commands\NotifyHostInstruction\NotifyHostInstructionCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host answers an instruction it claimed.
 */
#[TestsRoute('POST', 'agents.host.instructions.answer')]
final class HostInstructionsAnswerPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters(['instruction' => 'instruction-1'])
            ->payload(['instruction_id' => 'instruction-1', 'status' => 'done'])
            ->expects(NotifyHostInstructionCommand::class, [
                'hostId' => $host->hostId,
                'instructionId' => 'instruction-1',
            ]);
    }
}
