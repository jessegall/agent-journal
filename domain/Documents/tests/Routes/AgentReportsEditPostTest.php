<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Routes;

use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Exceptions\ReportUnchangeable;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * The entry test of POST documents.agent.reports.edit: the request is reached and answered with the refusal a report
 * always gives, as a report never changes, and nothing is dispatched.
 */
#[TestsRoute('POST', 'documents.agent.reports.edit')]
final class AgentReportsEditPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    public function test_the_request_is_reached_and_dispatches_what_it_declares(): void
    {
        $call = $this->arrangedCall();
        $this->journal->sinkCommands();

        $this->send($call, $call->caller)->assertConflict()->assertJsonPath('message', ReportUnchangeable::snapshot()->getMessage());
        $this->journal->assertDispatchedExactly([]);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $report = $journal->runAs('Writer', new CreateReportCommand('Check', 'What we found', "Text\n", TestProjects::local()->id));

        return RouteCall::as(Caller::Agent, $start)
            ->payload(['number' => (string) $report->number]);
    }
}
