<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Commands\CommandRules\OpenCommandRequest\OpenCommandRequestCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent asks the journal to explain a line it does not know, which holds a command request for it.
 */
#[TestsRoute('POST', 'processes.explain')]
final class ExplainPostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();

        return RouteCall::as(Caller::Agent, $this->start)
            ->payload([
                'line' => 'acme verify',
            ])
            ->reply(OpenCommandRequestCommand::class, $this->requestId)
            ->expects(OpenCommandRequestCommand::class, [
                'operation' => 'acme',
                'line' => 'acme verify',
            ]);
    }
}
