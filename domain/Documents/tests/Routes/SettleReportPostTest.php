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
use Tests\Support\TestProjects;

/**
 * The owner closes a report with a reason.
 */
#[TestsRoute('POST', 'documents.settle-report')]
final class SettleReportPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $report = $journal->run(new CreateReportCommand('Trace', 'The cause.', "# Trace\nFound it.", TestProjects::local()->id));

        return RouteCall::as(Caller::User)
            ->parameters(['report' => $report->number])
            ->payload(['reason' => 'Fixed in task 12.', 'revision' => 1])
            ->expects(CloseReportCommand::class, [
                'reportReference' => (string) $report->number,
                'reason' => 'Fixed in task 12.',
            ]);
    }
}
