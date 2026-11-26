<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Hosts\PullHostPrivateValue\PullHostPrivateValueCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host pulls a private value by its submission, once, for the write it was ordered.
 */
#[TestsRoute('POST', 'agents.host.private-values.pull')]
final class HostPrivateValuesPullPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters([
                'submission' => 'submission-1',
            ])
            ->payload([])
            ->reply(PullHostPrivateValueCommand::class, 'a value')
            ->expects(PullHostPrivateValueCommand::class, [
                'hostId' => $host->hostId,
                'submissionId' => 'submission-1',
            ]);
    }
}
