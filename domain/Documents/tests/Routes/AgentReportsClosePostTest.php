<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Routes;

use Domain\Documents\Commands\CloseReport\CloseReportCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\DocumentsDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent closes a report with a reason.
 */
#[TestsRoute('POST', 'documents.agent.reports.close')]
final class AgentReportsClosePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $report = $journal->runAs('Writer', new CreateReportCommand('Trace', 'The cause.', "# Trace\nFound it."));

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'number' => (string) $report->number,
                'reason' => 'Fixed in task 12.',
                'request_key' => 'documents-1',
            ])
            ->expects(CloseReportCommand::class, [
                'reportReference' => (string) $report->number,
                'reason' => 'Fixed in task 12.',
            ]);
    }
}
