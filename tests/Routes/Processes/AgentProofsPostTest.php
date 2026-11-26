<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\CommandRules\Commands\ProveReader\ProveReaderCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent asks to prove its draft reader against the samples it read.
 */
#[TestsRoute('POST', 'processes.agent.proofs')]
final class AgentProofsPostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $passed = $this->sample(0, self::PASSED_OUTPUT, isRead: true);
        $reader = $this->reader();

        return RouteCall::as(Caller::Agent, $this->start)
            ->parameters([
                'commandRequest' => $this->requestId,
            ])
            ->payload([
                'reader_revision' => $reader,
                'runs' => [
                    $passed,
                ],
                'request_key' => 'prove-1',
            ])
            ->reply(ProveReaderCommand::class, strtolower((string) Str::ulid()))
            ->expects(ProveReaderCommand::class, [
                'commandRequestId' => $this->requestId,
                'readerRevisionId' => $reader,
                'runIds' => [
                    $passed,
                ],
            ]);
    }
}
