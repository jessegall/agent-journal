<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent has a shell line of an approved command admitted as a run: nothing is sent on.
 */
#[TestsRoute('POST', 'processes.agent.admit')]
final class AgentAdmitPostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        config([
            'processes.runner' => true,
        ]);
        $journal->owner();
        $this->openAcmeRequest();
        $this->approvePair();

        return RouteCall::as(Caller::Agent, $this->start)
            ->payload([
                'line' => 'acme verify',
                'dialect' => 'bash',
                'working_folder' => sys_get_temp_dir(),
                'request_key' => 'admit-1',
            ]);
    }
}
