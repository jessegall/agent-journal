<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Routes;

use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Values\CreatedRecord;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent files a new report.
 */
#[TestsRoute('POST', 'documents.agent.reports.make')]
final class AgentReportsMakePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'title' => 'Trace',
                'abstract' => 'The cause.',
                'about' => [],
                'body' => '# Trace',
                'request_key' => 'documents-1',
            ])
            ->reply(CreateReportCommand::class, new CreatedRecord(
                strtolower((string) Str::ulid()),
                3,
                'documents.report',
            ))
            ->expects(CreateReportCommand::class, [
                'title' => 'Trace',
                'abstract' => 'The cause.',
                'body' => '# Trace',
                'relatedRecords' => [],
            ]);
    }
}
