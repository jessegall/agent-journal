<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\CommandRules\Commands\ProposeReader\ProposeReaderCommand;
use App\CommandRules\Values\RecordRule;
use App\Records\Enums\RecordRole;
use App\Values\ReaderDefinition;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent proposes a draft reader for the output of its command request.
 */
#[TestsRoute('POST', 'processes.agent.readers')]
final class AgentReadersPostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $definition = new ReaderDefinition([
            RecordRule::of(RecordRole::Summary, 'passed={passed:int} failed={failed:int}'),
        ], failureField: 'failed');

        return RouteCall::as(Caller::Agent, $this->start)
            ->parameters([
                'commandRequest' => $this->requestId,
            ])
            ->payload([
                'declaration_revision' => 1,
                'definition' => $definition->toArray(),
            ])
            ->reply(ProposeReaderCommand::class, strtolower((string) Str::ulid()))
            ->expects(ProposeReaderCommand::class, [
                'commandRequestId' => $this->requestId,
                'declarationRevision' => 1,
            ]);
    }
}
