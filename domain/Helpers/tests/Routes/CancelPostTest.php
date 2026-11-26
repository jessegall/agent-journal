<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Routes;

use Domain\Helpers\Commands\CancelHelperJob\CancelHelperJobCommand;
use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Tests\Fixtures\HelperFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent cancels a helper job it started.
 */
#[TestsRoute('POST', 'helpers.cancel')]
final class CancelPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(HelpersDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $helpers = $journal->fixtures(HelperFixtures::class)->openJob('Review', 'Planner', 'Review the change.');
        $job = $helpers->jobCalled('Review');

        return RouteCall::as(Caller::Agent, $start)
            ->payload(['job_id' => $job->id, 'request_key' => 'helper-1'])
            ->reply(CancelHelperJobCommand::class, $job->id)
            ->expects(CancelHelperJobCommand::class, ['jobId' => $job->id]);
    }
}
