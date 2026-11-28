<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Http\Pages\RunOutcomePageBuilder;
use App\Processes\Data\RunOutcomePageData;
use App\Web\Creation\PageFactory;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the outcome of one run.
 */
#[TestsRoute('GET', 'processes.run-outcome')]
final class RunOutcomeGetTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    public function test_the_outcome_builder_uses_the_effective_run_route(): void
    {
        $this->journal->owner();
        $this->openAcmeRequest();
        $run = $this->normalRun(0, self::PASSED_OUTPUT)->process_run_id;
        $this->journal->actAs('Owner');
        $visit = Request::create("/processes/runs/{$run}/outcome?run=ignored");
        $route = new Route('GET', '/processes/runs/{run}/outcome', []);
        $route->bind($visit);
        $visit->setRouteResolver(static fn () => $route);
        $factory = new PageFactory($this->app);
        $factory->register(RunOutcomePageData::class, RunOutcomePageBuilder::class);

        $this->assertSame($run, $factory->create(RunOutcomePageData::class, $visit)->runId);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $runId = $this->normalRun(0, self::PASSED_OUTPUT)->process_run_id;

        $journal->actAs('Owner');

        return RouteCall::as(Caller::User)
            ->parameters([
                'run' => $runId,
            ]);
    }
}
