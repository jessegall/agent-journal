<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Routes;

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
 * An agent reads a report.
 */
#[TestsRoute('POST', 'documents.agent.reports.show')]
final class AgentReportsShowPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $report = $journal->runAs('Writer', new CreateReportCommand('Trace', 'The cause.', "# Trace\nFound it.", TestProjects::local()->id));

        return RouteCall::as(Caller::Agent, $start)
            ->payload(['number' => (string) $report->number]);
    }
}
